<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit(0); }

require_once 'db-config.php';

$input = json_decode(file_get_contents('php://input'), true);
$action = $input['action'] ?? '';

if ($action === 'save_referral') {
    $referrer_name = $input['referrer_name'] ?? '';
    $referred_token = $input['referred_token'] ?? '';
    $session_id = $input['session_id'] ?? '';
    
    if ($referrer_name && $referred_token) {
        $stmt = $pdo->prepare("INSERT INTO referrals (referrer_name, referred_token, session_id, created_at) VALUES (?, ?, ?, NOW())");
        $stmt->execute([$referrer_name, $referred_token, $session_id]);
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Missing data']);
    }
} else {
    echo json_encode(['error' => 'Unknown action']);
}