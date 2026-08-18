<?php
require_once __DIR__ . '/db_connect.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit;
}

$json = file_get_contents('php://input');
$data = json_decode($json, true);

if (!is_array($data)) {
    $data = $_POST;
}

$email = trim((string)($data['email'] ?? ''));
$password = (string)($data['password'] ?? '');

if ($email === '' || $password === '') {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Email and password are required.']);
    exit;
}

$pdo = getDbConnection();
$stmt = $pdo->prepare('SELECT id, fullname_user AS name, email, password, price FROM user WHERE email = :email LIMIT 1');
$stmt->execute([':email' => $email]);
$user = $stmt->fetch();

if (!$user) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Invalid email or password.']);
    exit;
}

$storedPassword = (string)$user['password'];
$isValid = $storedPassword === $password || password_verify($password, $storedPassword);

if (!$isValid) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Invalid email or password.']);
    exit;
}

unset($user['password']);
$user['role'] = strtolower((string)$user['email']) === 'admin@receiptiq.com' ? 'admin' : 'user';

echo json_encode([
    'success' => true,
    'message' => 'Login successful.',
    'user' => $user,
]);
