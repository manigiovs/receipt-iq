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

$name = trim((string)($data['name'] ?? ''));
$email = trim(strtolower((string)($data['email'] ?? '')));
$password = (string)($data['password'] ?? '');

if ($name === '' || $email === '' || $password === '') {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Name, email, and password are required.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Please enter a valid email address.']);
    exit;
}

if (!str_ends_with($email, '@gmail.com')) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Only Gmail addresses ending in @gmail.com are allowed.']);
    exit;
}

$pdo = getDbConnection();
$checkStmt = $pdo->prepare('SELECT id FROM user WHERE email = :email LIMIT 1');
$checkStmt->execute([':email' => $email]);

if ($checkStmt->fetch()) {
    http_response_code(409);
    echo json_encode(['success' => false, 'message' => 'That email is already registered.']);
    exit;
}

$passwordHash = password_hash($password, PASSWORD_DEFAULT);

$insertStmt = $pdo->prepare("INSERT INTO user (fullname_user, password, email, price, role) VALUES (:name, :password, :email, 0.00, 'user')");
$insertStmt->execute([
    ':name' => $name,
    ':password' => $passwordHash,
    ':email' => $email,
]);

$userId = (int)$pdo->lastInsertId();

echo json_encode([
    'success' => true,
    'message' => 'Account created successfully.',
    'user' => [
        'id' => $userId,
        'name' => $name,
        'email' => $email,
        'role' => 'user',
        'price' => 0.00,
    ],
]);
