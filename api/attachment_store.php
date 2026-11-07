<?php
// Validation et extraction en mémoire des pièces jointes (aucun stockage durable).

const ASK_NIETZSCHE_UPLOAD_MAX_BYTES = 8388608;
const ASK_NIETZSCHE_TEXT_MAX_CHARS = 300000;

function attachment_rate_limit($bytes) {
    $dir = '/home/nietszche/.ratelimit_attachments';
    if (!is_dir($dir)) @mkdir($dir, 0700, true);
    if (!is_dir($dir) || !is_writable($dir)) refuse(503, 'Attachment rate limit unavailable');
    $path = $dir . '/' . hash('sha256', $_SERVER['REMOTE_ADDR'] ?? '');
    $fp = @fopen($path, 'c+');
    if (!$fp || !flock($fp, LOCK_EX)) {
        if ($fp) fclose($fp);
        refuse(503, 'Attachment rate limit unavailable');
    }
    $raw = stream_get_contents($fp);
    $records = $raw === '' ? [] : json_decode($raw, true);
    if (!is_array($records)) {
        flock($fp, LOCK_UN); fclose($fp);
        refuse(503, 'Attachment rate limit unavailable');
    }
    $now = time();
    $records = array_values(array_filter($records, fn($r) => is_array($r) && (int)($r['at'] ?? 0) > $now - 86400));
    $daily = array_sum(array_map(fn($r) => (int)($r['bytes'] ?? 0), $records));
    $recent = array_sum(array_map(fn($r) => (int)($r['bytes'] ?? 0), array_filter($records, fn($r) => (int)($r['at'] ?? 0) > $now - 600)));
    if ($daily + $bytes > 83886080 || $recent + $bytes > 33554432) {
        flock($fp, LOCK_UN); fclose($fp);
        refuse(429, 'Attachment rate limit reached');
    }
    $records[] = ['at' => $now, 'bytes' => (int)$bytes];
    ftruncate($fp, 0); rewind($fp);
    if (fwrite($fp, json_encode($records)) === false || !fflush($fp)) {
        flock($fp, LOCK_UN); fclose($fp);
        refuse(503, 'Attachment rate limit unavailable');
    }
    flock($fp, LOCK_UN); fclose($fp);
}

function attachment_error_for_upload($upload) {
    $code = (int)($upload['error'] ?? UPLOAD_ERR_NO_FILE);
    if ($code === UPLOAD_ERR_INI_SIZE || $code === UPLOAD_ERR_FORM_SIZE
        || (int)($upload['size'] ?? 0) > ASK_NIETZSCHE_UPLOAD_MAX_BYTES) return 'File too large';
    if ($code !== UPLOAD_ERR_OK) return 'Upload failed';
    if (!isset($upload['tmp_name']) || !is_uploaded_file($upload['tmp_name'])) return 'Invalid upload';
    return null;
}

function attachment_extract_docx($path) {
    if (!class_exists('ZipArchive') || !class_exists('DOMDocument') || !class_exists('DOMXPath')) return false;
    $zip = new ZipArchive();
    if ($zip->open($path) !== true) return false;
    $stat = $zip->statName('word/document.xml');
    if (!$stat || (int)$stat['size'] > 12000000) { $zip->close(); return false; }
    $xml = $zip->getFromName('word/document.xml');
    $zip->close();
    if (!is_string($xml)) return false;
    $dom = new DOMDocument();
    $previous = libxml_use_internal_errors(true);
    $ok = $dom->loadXML($xml, LIBXML_NONET | LIBXML_NOBLANKS);
    libxml_clear_errors();
    libxml_use_internal_errors($previous);
    if (!$ok) return false;
    $xpath = new DOMXPath($dom);
    $xpath->registerNamespace('w', 'http://schemas.openxmlformats.org/wordprocessingml/2006/main');
    $paragraphs = [];
    $length = 0;
    foreach ($xpath->query('//w:p') as $paragraph) {
        $words = [];
        foreach ($xpath->query('.//w:t', $paragraph) as $node) $words[] = $node->textContent;
        if ($words) {
            $line = implode('', $words);
            $remaining = ASK_NIETZSCHE_TEXT_MAX_CHARS - $length;
            if ($remaining <= 0) break;
            $line = mb_substr($line, 0, $remaining, 'UTF-8');
            $paragraphs[] = $line;
            $length += mb_strlen($line, 'UTF-8') + 1;
        }
    }
    return implode("\n", $paragraphs);
}

function attachment_process($upload) {
    $error = attachment_error_for_upload($upload);
    if ($error !== null) return [false, $error];

    $original = basename((string)($upload['name'] ?? 'document'));
    $name = preg_replace('/[^\pL\pN ._()\-]/u', '_', $original);
    $name = mb_substr(trim($name), 0, 150, 'UTF-8') ?: 'document';
    $extension = strtolower(pathinfo($name, PATHINFO_EXTENSION));
    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mime = $finfo->file($upload['tmp_name']);

    if ($extension === 'pdf' && $mime === 'application/pdf'
        && file_get_contents($upload['tmp_name'], false, null, 0, 5) === '%PDF-') {
        $attachment = ['kind' => 'pdf', 'mime' => 'application/pdf', 'data' => base64_encode(file_get_contents($upload['tmp_name']))];
    } elseif (in_array($extension, ['jpg', 'jpeg', 'png'], true)
        && in_array($mime, ['image/jpeg', 'image/png'], true)
        && ($image = @getimagesize($upload['tmp_name']))
        && $image['mime'] === $mime
        && (($extension === 'png' && $mime === 'image/png') || (in_array($extension, ['jpg', 'jpeg'], true) && $mime === 'image/jpeg'))) {
        $attachment = ['kind' => 'image', 'mime' => $mime, 'data' => base64_encode(file_get_contents($upload['tmp_name']))];
    } elseif (in_array($extension, ['txt', 'md'], true) && in_array($mime, ['text/plain', 'text/markdown'], true)) {
        $contents = file_get_contents($upload['tmp_name']);
        if (!is_string($contents) || !mb_check_encoding($contents, 'UTF-8')) return [false, 'Text file must use UTF-8 encoding'];
        $attachment = ['kind' => 'text', 'text' => mb_substr($contents, 0, ASK_NIETZSCHE_TEXT_MAX_CHARS, 'UTF-8')];
    } elseif ($extension === 'docx' && in_array($mime, ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/zip'], true)) {
        $text = attachment_extract_docx($upload['tmp_name']);
        if ($text === false || trim($text) === '') return [false, 'Could not read this DOCX file'];
        $attachment = ['kind' => 'text', 'text' => $text];
    } else {
        return [false, 'Unsupported file type'];
    }

    attachment_rate_limit((int)$upload['size']);

    $attachment['name'] = $name;
    return [$attachment, null];
}
