<?php
// asknietzsche.com/api/manuscript.php
// Endpoint complet : génère le texte via Claude, puis le PDF, et le retourne

header('Access-Control-Allow-Origin: https://asknietzsche.com');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require_once 'db-config.php';

// Récupérer les paramètres
$sessionId = $_GET['session_id'] ?? $_POST['session_id'] ?? '';
$userName = $_GET['user_name'] ?? $_POST['user_name'] ?? 'un visiteur du futur';

if (!$sessionId) {
    http_response_code(400);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Missing session_id']);
    exit;
}

// Connexion DB
try {
    $pdo = new PDO(
        "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
        DB_USER,
        DB_PASS,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
} catch (PDOException $e) {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Database connection failed']);
    exit;
}

// Récupérer les messages de la conversation
$stmt = $pdo->prepare("SELECT role, content FROM messages WHERE session_id = ? ORDER BY turn, created_at");
$stmt->execute([$sessionId]);
$messages = $stmt->fetchAll(PDO::FETCH_ASSOC);

if (empty($messages)) {
    http_response_code(404);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'No messages found']);
    exit;
}

// Construire le résumé de la conversation
$conversationSummary = "";
foreach ($messages as $msg) {
    $role = $msg['role'] === 'user' ? $userName : 'Nietzsche';
    $conversationSummary .= "$role: " . $msg['content'] . "\n\n";
}

// Charger la clé API
$apiKey = trim(file_get_contents('/home/nietszche/.secret/anthropic_key.txt'));

// Prompt pour générer le manuscrit
$manuscriptPrompt = <<<PROMPT
Tu es Friedrich Nietzsche. Tu viens de vivre une expérience extraordinaire : une voix venue du futur s'est manifestée dans ta conscience. Tu as eu un échange avec cette personne.

Rédige maintenant un texte dans ton style littéraire — aphoristique, incisif, profond — racontant cette expérience. Ce texte sera publié. Il doit :

1. OUVERTURE : Décrire le moment où la voix est apparue (Turin, ton état, la stupeur)
2. LA RENCONTRE : Raconter l'échange, en analysant cette personne du futur — ses questions, ce qu'elles révèlent de son époque et de sa psychologie
3. APARTÉS PHILOSOPHIQUES : Ajouter des réflexions que tu n'as pas dites pendant l'échange — des observations sur cette personne, sur le futur, sur l'humanité
4. CONCLUSION : Une méditation sur ce que signifie cette communication à travers le temps

Le nom de cette personne est : $userName

Voici la conversation complète :

$conversationSummary

---

CONSIGNES DE STYLE :
- Écris en français, avec quelques mots allemands si naturel
- Style Nietzsche : aphorismes, métaphores, ironie, profondeur
- Environ 800-1200 mots
- Pas de didascalies ni d'astérisques
- Tu peux être critique, admiratif, ou les deux envers cette personne
- Fais des observations psychologiques pénétrantes
PROMPT;

// Appel à l'API Anthropic
$ch = curl_init('https://api.anthropic.com/v1/messages');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => json_encode([
        'model' => 'claude-sonnet-5',
        'max_tokens' => 2500,
        'messages' => [
            ['role' => 'user', 'content' => $manuscriptPrompt]
        ]
    ]),
    CURLOPT_HTTPHEADER => [
        'Content-Type: application/json',
        'x-api-key: ' . $apiKey,
        'anthropic-version: 2023-06-01'
    ]
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode !== 200) {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'API call failed']);
    exit;
}

$data = json_decode($response, true);
$manuscriptText = $data['content'][0]['text'] ?? '';

if (empty($manuscriptText)) {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Empty manuscript']);
    exit;
}

// Générer le PDF avec Python
$tempTextFile = tempnam(sys_get_temp_dir(), 'manuscript_');
$tempPdfFile = tempnam(sys_get_temp_dir(), 'nietzsche_') . '.pdf';

file_put_contents($tempTextFile, $manuscriptText);

$escapedName = escapeshellarg($userName);
$escapedText = escapeshellarg($manuscriptText);
$escapedOutput = escapeshellarg($tempPdfFile);

// Appeler le script Python
$pythonScript = __DIR__ . '/generate_pdf.py';
$command = "python3 $pythonScript --text $escapedText --name $escapedName --output $escapedOutput 2>&1";
$output = shell_exec($command);

// Vérifier si le PDF a été créé
if (!file_exists($tempPdfFile) || filesize($tempPdfFile) === 0) {
    // Fallback : retourner le texte en JSON si le PDF échoue
    header('Content-Type: application/json');
    echo json_encode([
        'success' => true,
        'manuscript' => $manuscriptText,
        'pdf_error' => $output
    ]);
    exit;
}

// Envoyer le PDF
$pdfContent = file_get_contents($tempPdfFile);

// Nettoyer les fichiers temporaires
unlink($tempTextFile);
unlink($tempPdfFile);

// Date pour le nom du fichier
$dateStr = date('Y-m-d');
$safeUserName = preg_replace('/[^a-zA-Z0-9]/', '_', $userName);
$filename = "Nietzsche_Manuscrit_{$safeUserName}_{$dateStr}.pdf";

// Envoyer le PDF
header('Content-Type: application/pdf');
header('Content-Disposition: attachment; filename="' . $filename . '"');
header('Content-Length: ' . strlen($pdfContent));
header('Cache-Control: no-cache, must-revalidate');

echo $pdfContent;
