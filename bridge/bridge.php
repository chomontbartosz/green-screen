<?php
// MOST DO BAZY — jedyny plik aplikacji na home.pl. Baza MySQL na hostingu współdzielonym przyjmuje połączenia
// tylko z tego samego serwera, więc aplikacja (Vercel) prosi ten plik o wykonanie zapytania przez HTTPS.
// Bezpieczeństwo: wymagany tajny klucz w nagłówku X-Bridge-Secret i tylko zapytania z listy OPERATIONS
// (z parametrami, nigdy dowolny SQL). Sekrety są w bridge-config.php obok tego pliku.

declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');

function respond(int $status, array $data): void
{
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

$config = require __DIR__ . '/bridge-config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') respond(405, ['error' => 'Only POST']);
if (!hash_equals($config['secret'], $_SERVER['HTTP_X_BRIDGE_SECRET'] ?? '')) respond(401, ['error' => 'Unauthorized']);

const SCHEMA = <<<SQL
  CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    guest_name VARCHAR(32) NOT NULL,
    verified TINYINT(1) NOT NULL DEFAULT 0,
    verify_token VARCHAR(64) NULL,
    reset_token VARCHAR(64) NULL,
    reset_expires DATETIME NULL,
    failed_logins INT NOT NULL DEFAULT 0,
    locked_until DATETIME NULL,
    data JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )
SQL;

// nazwa => [zapytanie, 'one' (jeden wiersz) albo 'run' (zmiana)] — kolejność ? odpowiada tablicy params
const OPERATIONS = [
    'findUserByEmail' => ['SELECT * FROM users WHERE email = ?', 'one'],
    'findUserById' => ['SELECT * FROM users WHERE id = ?', 'one'],
    'findUserByVerifyToken' => ['SELECT * FROM users WHERE verify_token = ?', 'one'],
    'findUserByResetToken' => ['SELECT * FROM users WHERE reset_token = ? AND reset_expires > UTC_TIMESTAMP()', 'one'],
    'createUser' => ['INSERT INTO users (email, password_hash, guest_name, verify_token, data) VALUES (?, ?, ?, ?, ?)', 'run'],
    'saveUserData' => ['UPDATE users SET data = ? WHERE id = ?', 'run'],
    'markVerified' => ['UPDATE users SET verified = 1, verify_token = NULL WHERE id = ?', 'run'],
    'setResetToken' => ['UPDATE users SET reset_token = ?, reset_expires = ? WHERE id = ?', 'run'],
    'setPassword' => ['UPDATE users SET password_hash = ?, reset_token = NULL, reset_expires = NULL, failed_logins = 0, locked_until = NULL WHERE id = ?', 'run'],
    'recordFailedLogin' => ['UPDATE users SET failed_logins = failed_logins + 1, locked_until = ? WHERE id = ?', 'run'],
    'clearFailedLogins' => ['UPDATE users SET failed_logins = 0, locked_until = NULL WHERE id = ?', 'run'],
];

$request = json_decode(file_get_contents('php://input') ?: '', true);
$operation = OPERATIONS[$request['op'] ?? ''] ?? null;
$params = $request['params'] ?? [];
if (!$operation || !is_array($params)) respond(400, ['error' => 'Unknown operation']);

try {
    $db = $config['db'];
    $pdo = new PDO("mysql:host={$db['host']};dbname={$db['name']};charset=utf8mb4", $db['user'], $db['password'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
    $pdo->exec("SET time_zone = '+00:00'"); // wszystkie daty w UTC
    $pdo->exec(SCHEMA); // tabela tworzy się sama przy pierwszym użyciu

    [$sql, $kind] = $operation;
    $statement = $pdo->prepare($sql);
    $statement->execute(array_values($params));

    if ($kind === 'run') respond(200, ['ok' => true]);
    $row = $statement->fetch() ?: null;
    if ($row) $row['data'] = json_decode($row['data'], true);
    respond(200, ['row' => $row]);
} catch (Throwable $error) {
    error_log('[green-screen bridge] ' . $error->getMessage());
    $duplicate = $error instanceof PDOException && ($error->errorInfo[1] ?? null) === 1062;
    respond($duplicate ? 409 : 500, ['error' => $duplicate ? 'Duplicate' : 'Database error']);
}
