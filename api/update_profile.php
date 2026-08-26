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

$userId = (int)($data['id'] ?? 0);
$name = trim((string)($data['name'] ?? ''));
$email = trim(strtolower((string)($data['email'] ?? '')));

if ($userId <= 0 || $name === '' || $email === '') {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'User ID, name, and email are required.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL) || !str_ends_with($email, '@gmail.com')) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Please enter a valid Gmail address.']);
    exit;
}

$pdo = getDbConnection();
$checkStmt = $pdo->prepare('SELECT id FROM user WHERE email = :email AND id <> :id LIMIT 1');
$checkStmt->execute([':email' => $email, ':id' => $userId]);

if ($checkStmt->fetch()) {
    http_response_code(409);
    echo json_encode(['success' => false, 'message' => 'That email is already registered.']);
    exit;
}

$updateStmt = $pdo->prepare('UPDATE user SET fullname_user = :name, email = :email WHERE id = :id');
$updateStmt->execute([
    ':name' => $name,
    ':email' => $email,
    ':id' => $userId,
]);

$userStmt = $pdo->prepare('SELECT id, fullname_user AS name, email, price, role FROM user WHERE id = :id LIMIT 1');
$userStmt->execute([':id' => $userId]);
$user = $userStmt->fetch();

if (!$user) {
    http_response_code(404);
    echo json_encode(['success' => false, 'message' => 'User not found.']);
    exit;
}

$user['role'] = strtolower(trim((string)($user['role'] ?? 'user')));

echo json_encode([
    'success' => true,
    'message' => 'Profile updated successfully.',
    'user' => $user,
]);