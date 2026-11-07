<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: https://xi-app.pro');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$token  = trim($input['token'] ?? '');
$name   = trim($input['name']  ?? '');
$email  = trim($input['email'] ?? '');
$specs  = $input['specs'] ?? [];
$bio    = trim($input['bio']   ?? '');
$photo  = $input['photo'] ?? null;
$psyAff = !empty($input['psy_affiliate']) ? 1 : 0;

if (!$token || strlen($token) < 32) {
    echo json_encode(['ok' => false, 'error' => 'Token invalide']);
    exit;
}

require_once __DIR__ . '/../config/database.php';

try {
    $db = getDB();
    $specsJson = json_encode(array_values($specs));

    // Sauvegarder la photo si fournie
    $photoUrl = null;
    if ($photo && preg_match('/^data:(image\/[a-z+]+);base64,(.+)$/i', $photo, $m)) {
        $mime = $m[1];
        $ext  = match(strtolower($mime)) {
            'image/jpeg', 'image/jpg' => 'jpg',
            'image/png'               => 'png',
            'image/webp'              => 'webp',
            default                   => 'jpg'
        };
        $filename  = 'prac_' . substr($token, 0, 12) . '_' . time() . '.' . $ext;
        $photoDir  = __DIR__ . '/../m2h/photos/';
        $photoPath = $photoDir . $filename;
        file_put_contents($photoPath, base64_decode($m[2]));
        $photoUrl = 'https://xi-app.pro/m2h/photos/' . $filename;
    }

    $stmt = $db->prepare("
        UPDATE m2h_practitioners
        SET
            name          = COALESCE(NULLIF(?, ''), name),
            email         = COALESCE(NULLIF(?, ''), email),
            specialties   = ?,
            bio           = ?,
            photo_url     = COALESCE(?, photo_url),
            psy_affiliate = ?,
            status        = 'active',
            updated_at    = NOW()
        WHERE token = ?
        LIMIT 1
    ");
    $stmt->execute([$name, $email, $specsJson, $bio, $photoUrl, $psyAff, $token]);

    if ($stmt->rowCount() > 0) {
        echo json_encode(['ok' => true, 'photo_url' => $photoUrl]);
    } else {
        echo json_encode(['ok' => false, 'error' => 'Token non trouvé']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => $e->getMessage()]);
}
