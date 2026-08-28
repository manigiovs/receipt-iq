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

$email = strtolower($email);
if (!str_ends_with($email, '@gmail.com')) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Only Gmail addresses ending in @gmail.com are allowed.']);
    exit;
}

$pdo = getDbConnection();
$stmt = $pdo->prepare('SELECT id, fullname_user AS name, email, password, price, role, profile_pic FROM user WHERE email = :email LIMIT 1');
$stmt->execute([':email' => $email]);
$user = $stmt->fetch();

if (!$user) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Invalid email or password.']);
    exit;
}

$storedPassword = (string)$user['password'];
$isValid = password_verify($password, $storedPassword);

if (!$isValid) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Invalid email or password.']);
    exit;
}

unset($user['password']);
$user['profile_pic'] = !empty($user['profile_pic'])
    ? 'data:image/jpeg;base64,' . base64_encode($user['profile_pic'])
    : null;
$storedRole = strtolower(trim((string)($user['role'] ?? '')));
unset($user['role']);
$user['role'] = $storedRole !== ''
    ? $storedRole
    : (strtolower((string)$user['email']) === 'admin@gmail.com' ? 'admin' : 'user');
echo json_encode([
    'success' => true,
    'message' => 'Login successful.',
    'user' => $user,
]);
