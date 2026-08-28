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
$profilePicture = null;
if (isset($_FILES['profile_pic']) && $_FILES['profile_pic']['error'] === UPLOAD_ERR_OK) {
    $uploadedFile = $_FILES['profile_pic'];
    $maxProfilePictureBytes = 5 * 1024 * 1024;
    $allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
    $fileInfo = finfo_open(FILEINFO_MIME_TYPE);
    $mimeType = $fileInfo ? finfo_file($fileInfo, $uploadedFile['tmp_name']) : '';
    if ($fileInfo) {
        finfo_close($fileInfo);
    }

    if (!in_array($mimeType, $allowedMimeTypes, true)) {
        http_response_code(415);
        echo json_encode(['success' => false, 'message' => 'Only JPG, PNG, or WEBP profile pictures are allowed.']);
        exit;
    }

    if ((int)$uploadedFile['size'] > $maxProfilePictureBytes) {
        http_response_code(413);
        echo json_encode(['success' => false, 'message' => 'Profile pictures must be 5 MB or smaller.']);
        exit;
    }

    $profilePicture = file_get_contents($uploadedFile['tmp_name']);
} elseif (isset($_FILES['profile_pic']) && $_FILES['profile_pic']['error'] !== UPLOAD_ERR_NO_FILE) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'The profile picture upload failed.']);
    exit;
}

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

$updateSql = 'UPDATE user SET fullname_user = :name, email = :email';
$params = [
    ':name' => $name,
    ':email' => $email,
    ':id' => $userId,
];
if ($profilePicture !== null) {
    $updateSql .= ', profile_pic = :profile_pic';
    $params[':profile_pic'] = $profilePicture;
}
$updateSql .= ' WHERE id = :id';
$updateStmt = $pdo->prepare($updateSql);
$updateStmt->execute($params);

$userStmt = $pdo->prepare('SELECT id, fullname_user AS name, email, price, role, profile_pic FROM user WHERE id = :id LIMIT 1');
$userStmt->execute([':id' => $userId]);
$user = $userStmt->fetch();

if (!$user) {
    http_response_code(404);
    echo json_encode(['success' => false, 'message' => 'User not found.']);
    exit;
}

$user['role'] = strtolower(trim((string)($user['role'] ?? 'user')));
$user['profile_pic'] = !empty($user['profile_pic'])
    ? 'data:image/jpeg;base64,' . base64_encode($user['profile_pic'])
    : null;

echo json_encode([
    'success' => true,
    'message' => 'Profile updated successfully.',
    'user' => $user,
]);