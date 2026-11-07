<?php
/**
 * Xi — Lookup praticien par token
 *
 * GET /api/m2h-lookup.php?token=XXX
 * Retourne le nom et l'email du praticien si le token est valide.
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: https://xi-app.pro');

$token = trim($_GET['token'] ?? '');

if (!$token || strlen($token) < 32) {
    echo json_encode(['found' => false]);
    exit;
}

require_once __DIR__ . '/../config/database.php';

try {
    $db = getDB();
    $stmt = $db->prepare('
        SELECT name, email
        FROM m2h_practitioners
        WHERE token = ?
        LIMIT 1
    ');
    $stmt->execute([$token]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($row) {
        // Enregistrer le premier clic (clicked_at uniquement si pas encore défini)
        $upd = $db->prepare('
            UPDATE m2h_practitioners
            SET clicked_at = NOW()
            WHERE token = ? AND clicked_at IS NULL
        ');
        $upd->execute([$token]);

        echo json_encode([
            'found' => true,
            'name'  => $row['name']  ?? '',
            'email' => $row['email'] ?? '',
        ]);
    } else {
        echo json_encode(['found' => false]);
    }
} catch (Exception $e) {
    echo json_encode(['found' => false]);
}
