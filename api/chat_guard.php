<?php
// Garde de chat.php : limite par visiteur et liste blanche des prompts

function refuse($code, $reason) {
    $line = date('c') . ' ' . substr(hash('sha256', $_SERVER['REMOTE_ADDR'] ?? ''), 0, 12) . " $code $reason\n";
    @file_put_contents('/home/nietszche/logs/chat_refus.log', $line, FILE_APPEND | LOCK_EX);
    http_response_code($code);
    echo json_encode(['error' => $reason]);
    exit;
}

// Limite par visiteur : 40 appels par 10 minutes, 250 par jour
function rate_limit() {
    $dir = '/home/nietszche/.ratelimit_chat';
    if (!is_dir($dir)) @mkdir($dir, 0700);
    $file = $dir . '/' . hash('sha256', $_SERVER['REMOTE_ADDR'] ?? '');
    $fp = fopen($file, 'c+');
    if (!$fp || !flock($fp, LOCK_EX)) {
        if ($fp) fclose($fp);
        refuse(503, 'Rate limit unavailable');
    }
    $now = time();
    $hits = array_filter(json_decode(stream_get_contents($fp), true) ?: [], fn($t) => $t > $now - 86400);
    $recent = count(array_filter($hits, fn($t) => $t > $now - 600));
    if ($recent >= 40 || count($hits) >= 250) {
        flock($fp, LOCK_UN); fclose($fp);
        refuse(429, 'Too many requests');
    }
    $hits[] = $now;
    ftruncate($fp, 0); rewind($fp);
    if (fwrite($fp, json_encode(array_values($hits))) === false || !fflush($fp)) {
        flock($fp, LOCK_UN); fclose($fp);
        refuse(503, 'Rate limit unavailable');
    }
    flock($fp, LOCK_UN); fclose($fp);
}

function matches_any($text, $regexes) {
    foreach ($regexes as $r) {
        if (preg_match('~\A(?:' . $r . ')\z~u', $text)) return true;
    }
    return false;
}

// Le suffixe ajouté au prompt Nietzsche doit être une suite de blocs connus
function valid_injection($suffix, $regexes) {
    if (mb_strlen($suffix) > 6000) return false;
    while ($suffix !== '') {
        $advanced = false;
        foreach ($regexes as $r) {
            if (preg_match('~\A(?:' . $r . ')~u', $suffix, $m) && $m[0] !== '') {
                $suffix = substr($suffix, strlen($m[0]));
                $advanced = true;
                break;
            }
        }
        if (!$advanced) return false;
    }
    return true;
}

// Seuls les prompts écrits dans les pages du site sont acceptés (voir build_whitelist.py)
// Renvoie false, ['mode' => 'generator'] ou ['mode' => 'chat', 'lang' => ...]
function valid_request($system, $messages) {
    $wl = require __DIR__ . '/chat_whitelist.php';
    if (!is_string($system) || !is_array($messages) || !$messages || count($messages) > 80) return false;
    $total = 0;
    foreach ($messages as $m) {
        if (!is_array($m) || !is_string($m['content'] ?? null)) return false;
        if (!in_array($m['role'] ?? '', ['user', 'assistant'], true)) return false;
        $total += mb_strlen($m['content']);
        if (mb_strlen($m['content']) > 4000 || $total > 60000) return false;
    }
    if (in_array($system, $wl['generator_systems'], true)) {
        if (count($messages) !== 1) return false;
        $content = $messages[0]['content'];
        $ok = in_array($content, $wl['generator_exact'], true) || matches_any($content, $wl['generator_regex']);
        return $ok ? ['mode' => 'generator'] : false;
    }
    foreach ($wl['bases'] as [$base, $lang]) {
        if (strncmp($system, $base, strlen($base)) === 0
            && valid_injection(substr($system, strlen($base)), $wl['injection_regex'])) {
            return ['mode' => 'chat', 'lang' => $lang];
        }
    }
    return false;
}
