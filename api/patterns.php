<?php
// Banque d'ossatures explicites : définition éditoriale séparée du code.
function pattern_bank() {
    static $bank = null;
    if ($bank === null) {
        $data = json_decode(file_get_contents(__DIR__ . '/pattern_bank.json'), true);
        $bank = is_array($data['patterns'] ?? null) ? $data['patterns'] : [];
    }
    return $bank;
}

function pattern_resolve($requestedId, $messages) {
    $last = end($messages);
    if (!is_array($last) || ($last['role'] ?? '') !== 'user' || !is_string($last['content'] ?? null)) return null;
    $text = $last['content'];
    foreach (pattern_bank() as $pattern) {
        if (preg_match('/(?:n[’\']?utilise\s+pas|ne\s+pas\s+utiliser|do\s+not\s+use|don[’\']?t\s+use).{0,80}(?:aphorisme\s*1|aphorism\s*1|jgb[ -]?0?1|P-JGB-001)/iu', $text)) continue;
        if (is_string($requestedId) && hash_equals($pattern['id'], $requestedId)) return $pattern;
        if (stripos($text, $pattern['id']) !== false) return $pattern;
        // Require an affirmative application verb close to the aphorism reference.
        if (preg_match('/\b(?:utilise|utiliser|utilisant|applique|appliquer|use|using|apply|applies)\s+(?:l[’\']\s*)?(?:(?:l[’\']?ossature|la\s+structure|the\s+structure)\s+(?:de|of)\s+)?(?:par[- ]delà\s+bien\s+et\s+mal\s*[,;:]?\s*)?(?:l[’\']\s*)?(?:aphorisme\s*(?:n[°º]?\s*)?1|aphorism\s*1|jgb[ -]?0?1)\b/iu', $text)) return $pattern;
    }
    return null;
}

function pattern_prompt_block($pattern) {
    $steps = [];
    foreach ($pattern['moves'] as $i => $move) $steps[] = ($i + 1) . '. ' . $move;
    return "\n\nFORME EXPLICITEMENT DEMANDÉE — {$pattern['id']} ({$pattern['name']['fr']}, source {$pattern['source']})\n"
        . "Applique au texte soumis uniquement le mouvement de raisonnement ci-dessous. La source Nietzsche fournit une ossature, pas une doctrine à imposer : ne reprends ni sa thèse, ni ses formulations, ni ses exemples à moins qu'ils soient pertinents et étayés par la conversation ou le RAG. Réponds dans la langue de l'échange. Abandonne le schéma générique d'avis en trois motifs équilibrés ; suis ces étapes avec souplesse, sans les annoncer mécaniquement :\n"
        . implode("\n", $steps) . "\nLes règles RAG et de citation déjà présentes restent prioritaires.\n";
}
