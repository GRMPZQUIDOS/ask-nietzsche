<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit(0); }

require_once 'db-config.php';

$input = json_decode(file_get_contents('php://input'), true);
$action = $input['action'] ?? '';

switch ($action) {
    case 'check_user':
        $token = $input['token'] ?? '';
        if ($token) {
            $stmt = $pdo->prepare("SELECT display_name, full_name, last_message FROM users WHERE user_token = ? AND forgotten_at IS NULL");
            $stmt->execute([$token]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($user) {
                // Mettre à jour last_seen_at
                $update = $pdo->prepare("UPDATE users SET last_seen_at = NOW() WHERE user_token = ?");
                $update->execute([$token]);
                echo json_encode([
                    'exists' => true, 
                    'display_name' => $user['display_name'],
                    'full_name' => $user['full_name'],
                    'last_message' => $user['last_message']
                ]);
            } else {
                echo json_encode(['exists' => false]);
            }
        } else {
            echo json_encode(['exists' => false]);
        }
        break;

    case 'save_name':
        $token = $input['token'] ?? '';
        $displayName = $input['display_name'] ?? '';
        $fullName = $input['full_name'] ?? null;
        $sessionId = $input['session_id'] ?? '';
        
        if ($token && $displayName) {
            // Vérifier si l'utilisateur existe déjà
            $stmt = $pdo->prepare("SELECT id FROM users WHERE user_token = ?");
            $stmt->execute([$token]);
            $existing = $stmt->fetch();
            
            if ($existing) {
                // Mettre à jour
                $stmt = $pdo->prepare("UPDATE users SET display_name = ?, full_name = ?, last_seen_at = NOW() WHERE user_token = ?");
                $stmt->execute([$displayName, $fullName, $token]);
            } else {
                // Créer
                $stmt = $pdo->prepare("INSERT INTO users (user_token, display_name, full_name, consented_at, created_at, last_seen_at) VALUES (?, ?, ?, NOW(), NOW(), NOW())");
                $stmt->execute([$token, $displayName, $fullName]);
            }
            
            // Lier à la session si fournie
            if ($sessionId) {
                $stmt = $pdo->prepare("UPDATE sessions SET user_id = (SELECT id FROM users WHERE user_token = ?) WHERE id = ?");
                $stmt->execute([$token, $sessionId]);
            }
            
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'error' => 'Missing data']);
        }
        break;

    case 'save_last_message':
        $token = $input['token'] ?? '';
        $lastMessage = $input['last_message'] ?? '';
        if ($token && $lastMessage) {
            // Vérifier si l'utilisateur existe
            $stmt = $pdo->prepare("SELECT id FROM users WHERE user_token = ?");
            $stmt->execute([$token]);
            $existing = $stmt->fetch();
            
            if ($existing) {
                // Mettre à jour le dernier message
                $stmt = $pdo->prepare("UPDATE users SET last_message = ?, last_seen_at = NOW() WHERE user_token = ?");
                $stmt->execute([$lastMessage, $token]);
                echo json_encode(['success' => true]);
            } else {
                // Créer l'utilisateur avec juste le token et le message
                $stmt = $pdo->prepare("INSERT INTO users (user_token, last_message, created_at, last_seen_at) VALUES (?, ?, NOW(), NOW())");
                $stmt->execute([$token, $lastMessage]);
                echo json_encode(['success' => true, 'created' => true]);
            }
        } else {
            echo json_encode(['success' => false, 'error' => 'Missing data']);
        }
        break;

    case 'forget_me':
        $token = $input['token'] ?? '';
        if ($token) {
            $stmt = $pdo->prepare("UPDATE users SET forgotten_at = NOW(), display_name = NULL, full_name = NULL, last_message = NULL WHERE user_token = ?");
            $stmt->execute([$token]);
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false]);
        }
        break;

    case 'find_by_name':
        // Reconnexion manuelle par prénom + nom
        $fullName = $input['full_name'] ?? '';
        if ($fullName) {
            $stmt = $pdo->prepare("SELECT user_token, display_name, full_name, last_message FROM users WHERE full_name = ? AND forgotten_at IS NULL ORDER BY last_seen_at DESC LIMIT 1");
            $stmt->execute([$fullName]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($user) {
                // Mettre à jour last_seen_at
                $update = $pdo->prepare("UPDATE users SET last_seen_at = NOW() WHERE user_token = ?");
                $update->execute([$user['user_token']]);
                echo json_encode([
                    'found' => true, 
                    'token' => $user['user_token'], 
                    'display_name' => $user['display_name'],
                    'full_name' => $user['full_name'],
                    'last_message' => $user['last_message']
                ]);
            } else {
                echo json_encode(['found' => false]);
            }
        } else {
            echo json_encode(['found' => false, 'error' => 'Missing name']);
        }
        break;

    default:
        echo json_encode(['error' => 'Unknown action']);
}
