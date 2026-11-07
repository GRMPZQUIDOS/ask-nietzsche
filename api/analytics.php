<?php
// asknietzsche.com/api/analytics.php
// Endpoint sécurisé pour lire les analytics (lecture seule)

header('Content-Type: application/json');

// Clé secrète pour sécuriser l'accès
$secretKey = trim(file_get_contents('/home/nietszche/.secret/analytics_key.txt'));
$providedKey = $_GET['key'] ?? $_POST['key'] ?? '';

if ($providedKey !== $secretKey) {
    http_response_code(403);
    echo json_encode(['error' => 'Unauthorized']);
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

$action = $_GET['action'] ?? 'summary';

switch ($action) {
    
    case 'summary':
        // Résumé global
        $stats = [];
        
        $stmt = $pdo->query("SELECT COUNT(*) as total FROM sessions");
        $stats['total_sessions'] = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
        
        $stmt = $pdo->query("SELECT COUNT(*) as total FROM milestones WHERE milestone = 'awakening_complete'");
        $stats['completed_awakening'] = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
        
        $stmt = $pdo->query("SELECT COUNT(*) as total FROM milestones WHERE milestone = 'first_response'");
        $stats['first_response'] = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
        
        $stmt = $pdo->query("SELECT COUNT(*) as total FROM milestones WHERE milestone = 'future_reveal'");
        $stats['future_reveal'] = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
        
        $stmt = $pdo->query("SELECT COUNT(*) as total FROM milestones WHERE milestone = 'identity_human'");
        $stats['identity_human'] = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
        
        $stmt = $pdo->query("SELECT COUNT(*) as total FROM milestones WHERE milestone = 'identity_god'");
        $stats['identity_god'] = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
        
        $stmt = $pdo->query("SELECT AVG(total_messages) as avg FROM sessions WHERE total_messages > 0");
        $stats['avg_messages_per_session'] = round($stmt->fetch(PDO::FETCH_ASSOC)['avg'], 1);
        
        echo json_encode($stats, JSON_PRETTY_PRINT);
        break;
        
    case 'sessions':
        // Liste des sessions récentes
        $limit = min((int)($_GET['limit'] ?? 20), 100);
        $stmt = $pdo->prepare("
            SELECT s.*, GROUP_CONCAT(m.milestone) as milestones
            FROM sessions s
            LEFT JOIN milestones m ON s.id = m.session_id
            GROUP BY s.id
            ORDER BY s.started_at DESC
            LIMIT ?
        ");
        $stmt->execute([$limit]);
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC), JSON_PRETTY_PRINT);
        break;
        
    case 'session_detail':
        // Détail d'une session
        $sessionId = $_GET['session_id'] ?? '';
        if (!$sessionId) {
            echo json_encode(['error' => 'Missing session_id']);
            exit;
        }
        
        $stmt = $pdo->prepare("SELECT * FROM sessions WHERE id = ?");
        $stmt->execute([$sessionId]);
        $session = $stmt->fetch(PDO::FETCH_ASSOC);
        
        $stmt = $pdo->prepare("SELECT * FROM messages WHERE session_id = ? ORDER BY turn, created_at");
        $stmt->execute([$sessionId]);
        $messages = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        $stmt = $pdo->prepare("SELECT * FROM milestones WHERE session_id = ? ORDER BY reached_at");
        $stmt->execute([$sessionId]);
        $milestones = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode([
            'session' => $session,
            'messages' => $messages,
            'milestones' => $milestones
        ], JSON_PRETTY_PRINT);
        break;
        
    case 'dropoff':
        // Analyse des abandons par nombre de messages
        $stmt = $pdo->query("
            SELECT total_messages, COUNT(*) as nb_sessions
            FROM sessions
            GROUP BY total_messages
            ORDER BY total_messages
        ");
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC), JSON_PRETTY_PRINT);
        break;
        
    case 'funnel':
        // Funnel complet
        $funnel = [];
        
        $stmt = $pdo->query("SELECT COUNT(*) as c FROM sessions");
        $funnel['1_sessions_started'] = $stmt->fetch()['c'];
        
        $stmt = $pdo->query("SELECT COUNT(DISTINCT session_id) as c FROM milestones WHERE milestone = 'awakening_complete'");
        $funnel['2_awakening_complete'] = $stmt->fetch()['c'];
        
        $stmt = $pdo->query("SELECT COUNT(DISTINCT session_id) as c FROM milestones WHERE milestone = 'first_response'");
        $funnel['3_first_response'] = $stmt->fetch()['c'];
        
        $stmt = $pdo->query("SELECT COUNT(DISTINCT session_id) as c FROM milestones WHERE milestone IN ('identity_human', 'identity_god')");
        $funnel['4_identity_declared'] = $stmt->fetch()['c'];
        
        $stmt = $pdo->query("SELECT COUNT(DISTINCT session_id) as c FROM milestones WHERE milestone = 'future_reveal'");
        $funnel['5_future_revealed'] = $stmt->fetch()['c'];
        
        echo json_encode($funnel, JSON_PRETTY_PRINT);
        break;
        
    default:
        echo json_encode(['error' => 'Unknown action', 'available' => ['summary', 'sessions', 'session_detail', 'dropoff', 'funnel']]);
}
