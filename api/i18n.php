<?php
/**
 * Ask Nietzsche — API i18n
 * Sert les traductions, messages d'éveil et patterns depuis la DB
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

// Connexion DB directe
try {
    $pass = trim(file_get_contents('/home/nietszche/.secret/db_password.txt'));
    $pdo = new PDO(
        'mysql:host=mysql.asknietzsche.com;dbname=nietzsche;charset=utf8mb4',
        'asknietzsche',
        $pass,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        ]
    );
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed']);
    exit;
}

$type = $_GET['type'] ?? '';
$lang = $_GET['lang'] ?? 'fr';

// Valider la langue
$validLangs = ['fr', 'en', 'de', 'es', 'zh', 'ja'];
if (!in_array($lang, $validLangs)) {
    $lang = 'fr';
}

try {
    switch ($type) {
        case 'translations':
            $stmt = $pdo->prepare("SELECT key_name, value FROM translations WHERE lang = ?");
            $stmt->execute([$lang]);
            echo json_encode($stmt->fetchAll());
            break;
            
        case 'awakening':
            $stmt = $pdo->prepare("SELECT sequence_order, content, delay_ms FROM awakening_messages WHERE lang = ? ORDER BY sequence_order");
            $stmt->execute([$lang]);
            echo json_encode($stmt->fetchAll());
            break;
            
        case 'triggers':
            $stmt = $pdo->prepare("SELECT trigger_type, pattern, priority FROM trigger_patterns WHERE lang = ? ORDER BY trigger_type, priority DESC");
            $stmt->execute([$lang]);
            echo json_encode($stmt->fetchAll());
            break;
            
        case 'all':
            $response = [
                'lang' => $lang,
                'translations' => [],
                'awakening' => [],
                'triggers' => []
            ];
            
            // Translations
            $stmt = $pdo->prepare("SELECT key_name, value FROM translations WHERE lang = ?");
            $stmt->execute([$lang]);
            foreach ($stmt->fetchAll() as $row) {
                $response['translations'][$row['key_name']] = $row['value'];
            }
            
            // Awakening
            $stmt = $pdo->prepare("SELECT sequence_order, content, delay_ms FROM awakening_messages WHERE lang = ? ORDER BY sequence_order");
            $stmt->execute([$lang]);
            $response['awakening'] = $stmt->fetchAll();
            
            // Triggers
            $stmt = $pdo->prepare("SELECT trigger_type, pattern FROM trigger_patterns WHERE lang = ? ORDER BY trigger_type, priority DESC");
            $stmt->execute([$lang]);
            foreach ($stmt->fetchAll() as $row) {
                if (!isset($response['triggers'][$row['trigger_type']])) {
                    $response['triggers'][$row['trigger_type']] = [];
                }
                $response['triggers'][$row['trigger_type']][] = $row['pattern'];
            }
            
            echo json_encode($response);
            break;
            
        default:
            http_response_code(400);
            echo json_encode(['error' => 'Invalid type. Use: translations, awakening, triggers, or all']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
