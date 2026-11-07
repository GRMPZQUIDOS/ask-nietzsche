<?php
// Recherche documentaire dans les textes de Nietzsche (corpus VRAG/Nietzsche/nietzsche.sqlite)
// 1. Haiku extrait des mots-clés allemands, anglais et français de la question
// 2. SQLite FTS5 (bm25) retrouve les passages
// 3. Les passages sont ajoutés au prompt avec un protocole de citation
// 4. Chaque citation de la réponse est vérifiée contre le passage avant affichage

const RAG_DB = '/home/nietszche/rag/nietzsche.sqlite';
const RAG_MAX_SOURCES = 5;
const RAG_KEYWORD_MODEL = 'claude-haiku-5-5';

const RAG_LANG_NAMES = [
    'en' => 'English', 'fr' => 'French', 'de' => 'German',
    'es' => 'Spanish', 'ja' => 'Japanese', 'zh' => 'Chinese',
];

function rag_call_claude($apiKey, $payload, $timeout = 20) {
    $ch = curl_init('https://api.anthropic.com/v1/messages');
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_TIMEOUT => $timeout,
        CURLOPT_POSTFIELDS => json_encode($payload),
        CURLOPT_HTTPHEADER => [
            'Content-Type: application/json',
            'x-api-key: ' . $apiKey,
            'anthropic-version: 2023-06-01'
        ]
    ]);
    $response = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    return [$code, $response ? json_decode($response, true) : null];
}

// Mots-clés de recherche ; relevant=false pour une salutation ou une phrase sans contenu à chercher
function rag_keywords($apiKey, $messages) {
    $recent = array_slice($messages, -3);
    $dialogue = '';
    foreach ($recent as $m) {
        $who = $m['role'] === 'user' ? 'Visitor' : 'Nietzsche';
        $dialogue .= "$who: " . mb_substr($m['content'], 0, 1200) . "\n";
    }
    $prompt = "A visitor is talking with Nietzsche. Here is the end of the conversation:\n\n$dialogue\n"
        . "Give search terms to find passages of Nietzsche's own writings that bear on the visitor's LAST message. "
        . "Give 3 to 8 terms in each language: German (Nietzsche's own 19th-century vocabulary and spelling where it matters, e.g. Mitleid, Übermensch, Werth), English and French. "
        . "Single words or two-word phrases. Set relevant to false when the last message is a greeting, small talk, "
        . "a name, or anything that no passage of his writings could bear on.";
    $schema = [
        'type' => 'object',
        'properties' => [
            'relevant' => ['type' => 'boolean'],
            'de' => ['type' => 'array', 'items' => ['type' => 'string']],
            'en' => ['type' => 'array', 'items' => ['type' => 'string']],
            'fr' => ['type' => 'array', 'items' => ['type' => 'string']],
        ],
        'required' => ['relevant', 'de', 'en', 'fr'],
        'additionalProperties' => false,
    ];
    [$code, $data] = rag_call_claude($apiKey, [
        'model' => RAG_KEYWORD_MODEL,
        'max_tokens' => 1024,
        'output_config' => ['effort' => 'low', 'format' => ['type' => 'json_schema', 'schema' => $schema]],
        'messages' => [['role' => 'user', 'content' => $prompt]],
    ]);
    if ($code !== 200 || !$data) return null;
    foreach ($data['content'] ?? [] as $block) {
        if (($block['type'] ?? '') === 'text') {
            $kw = json_decode($block['text'], true);
            if (is_array($kw)) return $kw;
        }
    }
    return null;
}

function rag_fts_query($kw) {
    $terms = [];
    foreach (['de', 'en', 'fr'] as $l) {
        foreach (array_slice($kw[$l] ?? [], 0, 8) as $t) {
            $t = trim(preg_replace('/[^\p{L}\p{N}\s-]/u', ' ', (string)$t));
            $t = preg_replace('/\s+/u', ' ', $t);
            if (mb_strlen($t) < 3) continue;
            // mot seul : recherche par préfixe pour couvrir les flexions (Mitleid* → Mitleidens, Mitleidigen)
            $terms[mb_strtolower($t)] = (mb_strlen($t) >= 5 && preg_match('/^[\p{L}]+$/u', $t)) ? $t . '*' : '"' . $t . '"';
        }
    }
    return implode(' OR ', $terms);
}

// Passages groupés par référence ; on garde la langue du visiteur si elle existe, sinon l'original
function rag_search($kw, $lang) {
    $query = rag_fts_query($kw);
    if ($query === '' || !is_file(RAG_DB)) return [];
    $db = new SQLite3(RAG_DB, SQLITE3_OPEN_READONLY);
    $stmt = $db->prepare('SELECT p.*, bm25(passages_fts) AS score FROM passages_fts
                          JOIN passages p ON p.id = passages_fts.rowid
                          WHERE passages_fts MATCH :q ORDER BY score LIMIT 60');
    $stmt->bindValue(':q', $query, SQLITE3_TEXT);
    $res = @$stmt->execute();
    if (!$res) return [];
    $groups = [];
    while ($row = $res->fetchArray(SQLITE3_ASSOC)) {
        $key = $row['siglum'] ?: preg_replace('/ \(\d+\/\d+\)$/', '', $row['label']);
        $groups[$key][] = $row;
    }
    // même passage dans la langue du visiteur (traduction libre de droits), s'il existe dans le corpus
    $same = $db->prepare('SELECT p.*, bm25(passages_fts) AS score FROM passages_fts
                          JOIN passages p ON p.id = passages_fts.rowid
                          WHERE passages_fts MATCH :q AND p.siglum = :s AND p.lang = :l ORDER BY score LIMIT 1');
    $first = $db->prepare('SELECT * FROM passages WHERE siglum = :s AND lang = :l ORDER BY id LIMIT 1');
    $picked = [];
    foreach ($groups as $key => $rows) {
        $best = null;
        foreach ($rows as $r) if ($r['lang'] === $lang) { $best = $r; break; }
        if (!$best && $rows[0]['siglum']) {
            foreach ([[$same, true], [$first, false]] as [$st, $withQuery]) {
                $st->reset();
                if ($withQuery) $st->bindValue(':q', $query, SQLITE3_TEXT);
                $st->bindValue(':s', $rows[0]['siglum'], SQLITE3_TEXT);
                $st->bindValue(':l', $lang, SQLITE3_TEXT);
                $r = $st->execute()->fetchArray(SQLITE3_ASSOC);
                if ($r) { $best = $r; break; }
            }
        }
        if (!$best) foreach ($rows as $r) if ($r['lang'] === 'de') { $best = $r; break; }
        if (!$best) $best = $rows[0];
        $picked[] = $best;
        if (count($picked) >= RAG_MAX_SOURCES) break;
    }
    return $picked;
}

function rag_kind_label($kind) {
    return $kind === 'posthumous' ? 'posthumous note (unpublished by Nietzsche)' : 'published work';
}

function rag_prompt_block($sources, $lang) {
    $reply = RAG_LANG_NAMES[$lang] ?? 'English';
    if (!$sources) {
        return "\n\n[YOUR WRITINGS]\nNo passage of your writings was found for this message. Answer as usual, without quoting or citing any book, aphorism number or sentence of yours. "
            . "If the interlocutor asks where you wrote something, say plainly, in character, that you cannot point to the passage now.";
    }
    $out = "\n\n[YOUR WRITINGS]\nThese passages of your own writings were retrieved for the interlocutor's last message. "
        . "Use them only if they truly bear on it; ignore the others.\n";
    foreach ($sources as $i => $s) {
        $n = $i + 1;
        $tr = $s['translator'] ? ", translated by {$s['translator']}" : '';
        $out .= "\n<passage n=\"$n\" ref=\"{$s['work']}, {$s['label']}\" language=\"{$s['lang']}\" type=\"" . rag_kind_label($s['kind']) . "\"$tr>\n"
            . $s['text'] . "\n</passage>\n";
    }
    $out .= "\nQUOTATION RULES (strict):\n"
        . "- Your reply is in $reply. Keep your usual conversational voice; quote at most twice, briefly (under 40 words each).\n"
        . "- Exact quotation, only from a passage written in $reply: ⟦q:N|words copied exactly from passage N⟧\n"
        . "- Quotation from a passage in another language: ⟦t:N|words copied exactly from passage N in its language|your $reply translation⟧\n"
        . "- To refer to a passage without quoting it: ⟦r:N⟧ right after the sentence that draws on it.\n"
        . "- Never put quotation marks around words of yours that are not in these markers, and never name a book, aphorism number or quotation that is not in the passages above.\n"
        . "- If no passage bears on the message, use no marker. If the interlocutor asks for a source you do not have, say so in character.";
    return $out;
}

function rag_norm($s) {
    $s = mb_strtolower(html_entity_decode($s, ENT_QUOTES, 'UTF-8'));
    $s = preg_replace('/[^\p{L}\p{N}]+/u', ' ', $s);
    return trim($s);
}

// Remplace les marqueurs ; une citation qui ne figure pas mot pour mot dans le passage perd ses guillemets
function rag_postprocess($text, $sources, $lang) {
    // guillemets hors marqueurs : retirés, seules les citations vérifiées en portent
    $parts = preg_split('/(⟦[^⟧]*⟧)/u', $text, -1, PREG_SPLIT_DELIM_CAPTURE);
    foreach ($parts as $i => $p) {
        // un mot ou un terme court entre guillemets reste (néologismes) ; une phrase perd ses guillemets
        if ($i % 2 === 0) $parts[$i] = preg_replace_callback('/["“«„]\s?([^"“”«»„\n]{1,500}?)\s?["”»“]/u',
            fn($m) => count(preg_split('/\s+/u', trim($m[1]))) >= 4 ? $m[1] : $m[0], $p);
    }
    $text = implode('', $parts);
    $used = [];
    $stats = ['exact' => 0, 'translation' => 0, 'rejected' => 0];
    $num = function ($n) use (&$used, $sources) {
        if (!isset($sources[$n - 1])) return null;
        if (!isset($used[$n])) $used[$n] = ['n' => count($used) + 1, 'quotes' => []];
        return $used[$n]['n'];
    };
    [$open, $close] = ['fr' => ['« ', ' »'], 'es' => ['«', '»'], 'de' => ['„', '“'], 'ja' => ['「', '」']][$lang] ?? ['“', '”'];
    $trLabel = ['en' => 'tr.', 'fr' => 'trad.', 'es' => 'trad.', 'de' => 'Übers.', 'ja' => '訳', 'zh' => '译'][$lang] ?? 'tr.';
    $out = preg_replace_callback('/⟦([qtr]):(\d+)(?:\|([^⟧|]*))?(?:\|([^⟧]*))?⟧/u', function ($m) use (&$used, &$stats, $sources, $num, $open, $close, $trLabel) {
        $n = (int)$m[2];
        $src = $sources[$n - 1] ?? null;
        if (!$src) return isset($m[4]) && $m[4] !== '' ? $m[4] : ($m[3] ?? '');
        $hay = ' ' . rag_norm($src['text']) . ' ';
        if ($m[1] === 'r') return ' [' . $num($n) . ']';
        $orig = trim($m[3] ?? '');
        $ok = $orig !== '' && mb_strlen(rag_norm($orig)) >= 8 && mb_strpos($hay, ' ' . rag_norm($orig) . ' ') !== false;
        if ($m[1] === 'q') {
            if (!$ok) { $stats['rejected']++; return $orig; }
            $k = $num($n); $used[$n]['quotes'][] = ['type' => 'exact', 'text' => $orig]; $stats['exact']++;
            return "$open$orig$close [$k]";
        }
        $trans = trim($m[4] ?? '');
        if (!$ok || $trans === '') { $stats['rejected']++; return $trans !== '' ? $trans : $orig; }
        $k = $num($n); $used[$n]['quotes'][] = ['type' => 'translation', 'original' => $orig, 'text' => $trans]; $stats['translation']++;
        return "$open$trans$close [$k, $trLabel]";
    }, $text);
    $out = preg_replace('/⟦[^⟧]*⟧?/u', '', $out);  // marqueur mal formé
    $out = preg_replace('/ +([.,])/u', '$1', $out);
    $out = preg_replace('/[ \t]+\[(\d)/u', ' [$1', $out);

    $list = [];
    foreach ($used as $n => $u) {
        $s = $sources[$n - 1];
        $list[$u['n'] - 1] = [
            'n' => $u['n'], 'work' => $s['work'], 'ref' => $s['siglum'] ?: $s['label'], 'label' => $s['label'],
            'lang' => $s['lang'], 'kind' => $s['kind'], 'translator' => $s['translator'], 'edition' => $s['edition'],
            'ns_url' => $s['ns_url'], 'source_url' => $s['source_url'], 'quotes' => $u['quotes'],
        ];
    }
    ksort($list);
    return [$out, array_values($list), $stats];
}
