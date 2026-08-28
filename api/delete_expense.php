<?php
require_once __DIR__ . '/db_connect.php';

// 2. Guard the method
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit;
}

// 3. Read the body
$data = json_decode(file_get_contents('php://input'), true);
if (!is_array($data)) { $data = $_POST; }

// 4. Validate
$id     = isset($data['id']) ? (int)$data['id'] : 0;
$userId = isset($data['user_id']) ? (int)$data['user_id'] : 0;

if ($id <= 0 || $userId <= 0) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Expense id and user id are required.']);
    exit;
}

$pdo = getDbConnection();

// 5a. Ownership check FIRST — same fix you just made to update
$check = $pdo->prepare('SELECT id FROM expenses_tbl WHERE id = :id AND user_id = :user_id');
$check->execute([':id' => $id, ':user_id' => $userId]);

if (!$check->fetch()) {
    http_response_code(404);
    echo json_encode(['success' => false, 'message' => 'Expense not found or not yours.']);
    exit;
}

// 5b. Delete after verifying ownership
$stmt = $pdo->prepare(
    'DELETE FROM expenses_tbl
     WHERE id = :id AND user_id = :user_id'
);
$stmt->execute([':id' => $id, ':user_id' => $userId]);

// 6. Respond
echo json_encode([
    'success' => true,
    'message' => 'Expense deleted.',
    'id'      => $id,
]);