<?php
/**
 * Xi — Tracking email invitations psychologues
 *
 * GET /api/track.php?type=open&token=XXX   → pixel 1x1 transparent
 * GET /api/track.php?type=click&token=XXX  → redirect vers xi-app.pro/m2h/?token=XXX
 * GET /api/track.php?type=click&token=XXX&dest=beta → redirect vers xi-app.pro/m2h/beta/
 * GET /api/track.php?type=click&token=XXX&dest=app  → redirect vers xi-app.pro/?dev=1
 */

require_once __DIR__ . '/../config/database.php';

$type  = $_GET['type']  ?? '';
$token = $_GET['token'] ?? '';
$dest  = $_GET['dest']  ?? '';

if ($token) {
    try {
        $db = getDB();
        if ($type === 'open') {
            $db->prepare('
                UPDATE m2h_practitioners
                SET opened_at = COALESCE(opened_at, NOW())
                WHERE token = ?
            ')->execute([$token]);
        } elseif ($type === 'click') {
            $db->prepare('
                UPDATE m2h_practitioners
                SET clicked_at = COALESCE(clicked_at, NOW())
                WHERE token = ?
            ')->execute([$token]);
        }
    } catch (Exception $e) {
        // Fail silently — ne jamais bloquer pour du tracking
    }
}

if ($type === 'click') {
    // Redirect selon destination
    switch ($dest) {
        case 'beta':
            $url = 'https://xi-app.pro/m2h/beta/';
            break;
        case 'app':
            $url = 'https://xi-app.pro/?dev=1';
            break;
        default:
            $url = 'https://xi-app.pro/m2h/?token=' . urlencode($token);
            break;
    }
    header('Location: ' . $url, true, 302);
    exit;
}

// Pixel 1x1 transparent
header('Content-Type: image/png');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');
echo base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4nGNgYGBgAAAABQABpfZFQAAAAABJRU5ErkJggg==');
