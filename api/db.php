<?php
define('DB_HOST', 'localhost');
define('DB_NAME', 'hopflix');
define('DB_USER', 'root');    
define('DB_PASS', '1234');          
define('DB_CHARSET', 'utf8mb4');

function getDB(): PDO {
    static $pdo = null;
    if ($pdo === null) {
        $dsn = 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=' . DB_CHARSET;
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];
        try {
            $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        } catch (PDOException $e) {
            http_response_code(500);
            header('Content-Type: application/json');
            echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]);
            exit;
        }
    }
    return $pdo;
}

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

function jsonResponse(array $data, int $status = 200): void {
    http_response_code($status);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}

function sessionUserId(): ?int {
    return $_SESSION['user_id'] ?? null;
}


function sessionUserRole(): ?string {
    return $_SESSION['user_role'] ?? null;
}

function requireLogin(): void {
    if (!sessionUserId()) {
        jsonResponse(['error' => 'Not authenticated'], 401);
    }
}

function requireAdmin(): void {
    requireLogin();
    if (sessionUserRole() !== 'admin') {
        jsonResponse(['error' => 'Forbidden — admin only'], 403);
    }
}

function jsonBody(): array {
    $raw = file_get_contents('php://input');
    return json_decode($raw, true) ?? [];
}
