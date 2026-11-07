<?php
// asknietzsche.com/api/log-conversation.php
// Logger les événements de conversation pour analytics

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: https://asknietzsche.com');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

require_once 'db-config.php';

try {
    $pdo = new PDO(
        "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
        DB_USER,
        DB_PASS,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

if (!$input || !isset($input['action'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing action']);
    exit;
}

$action = $input['action'];
$sessionId = $input['session_id'] ?? null;
$lang = $input['lang'] ?? 'fr';

switch ($action) {
    
    case 'start_session':
        // Créer une nouvelle session
        $stmt = $pdo->prepare("INSERT INTO sessions (id, lang) VALUES (?, ?)");
        $stmt->execute([$sessionId, $lang]);
        
        // Logger le milestone
        $stmt = $pdo->prepare("INSERT INTO milestones (session_id, milestone) VALUES (?, 'session_start')");
        $stmt->execute([$sessionId]);
        
        echo json_encode(['success' => true]);
        break;
        
    case 'log_message':
        // Logger un message
        $role = $input['role'] ?? 'user';
        $content = $input['content'] ?? '';
        $turn = $input['turn'] ?? 1;
        
        $stmt = $pdo->prepare("INSERT INTO messages (session_id, turn, role, content) VALUES (?, ?, ?, ?)");
        $stmt->execute([$sessionId, $turn, $role, $content]);
        
        // Mettre à jour le compteur de messages
        $stmt = $pdo->prepare("UPDATE sessions SET total_messages = total_messages + 1 WHERE id = ?");
        $stmt->execute([$sessionId]);
        
        echo json_encode(['success' => true]);
        break;
        
    case 'log_milestone':
        // Logger un milestone
        $milestone = $input['milestone'] ?? '';
        
        // Vérifier qu'on n'a pas déjà ce milestone pour cette session
        $stmt = $pdo->prepare("SELECT id FROM milestones WHERE session_id = ? AND milestone = ?");
        $stmt->execute([$sessionId, $milestone]);
        
        if (!$stmt->fetch()) {
            $stmt = $pdo->prepare("INSERT INTO milestones (session_id, milestone) VALUES (?, ?)");
            $stmt->execute([$sessionId, $milestone]);
            
            // Si c'est level2, mettre à jour la session
            if ($milestone === 'level2_unlocked') {
                $stmt = $pdo->prepare("UPDATE sessions SET reached_level2 = TRUE WHERE id = ?");
                $stmt->execute([$sessionId]);
            }
        }
        
        echo json_encode(['success' => true]);
        break;
        
    default:
        http_response_code(400);
        echo json_encode(['error' => 'Unknown action']);
}
