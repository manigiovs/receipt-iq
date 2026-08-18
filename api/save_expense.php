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

$userId = isset($data['user_id']) ? (int)$data['user_id'] : 0;
$name = trim((string)($data['name'] ?? ''));
$category = trim((string)($data['category'] ?? 'Shopping'));
$amountRaw = $data['amount'] ?? 0;
$note = trim((string)($data['note'] ?? ''));
$date = trim((string)($data['date'] ?? ''));
$image = trim((string)($data['image'] ?? ''));

if ($userId <= 0 || $name === '' || $amountRaw === '') {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Missing user, name, or amount.']);
    exit;
}

$amount = (float)$amountRaw;
if (!is_numeric($amountRaw) || $amount <= 0) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Amount must be greater than zero.']);
    exit;
}

if ($date === '') {
    $date = date('Y-m-d');
}

$pdo = getDbConnection();

$stmt = $pdo->prepare(
    'INSERT INTO expenses_tbl (user_id, merchant_name, category, amount, receipt_date, description, image_path, created_at)
     VALUES (:user_id, :merchant_name, :category, :amount, :receipt_date, :description, :image_path, NOW())'
);

$stmt->execute([
    ':user_id' => $userId,
    ':merchant_name' => $name,
    ':category' => $category,
    ':amount' => number_format($amount, 2, '.', ''),
    ':receipt_date' => $date,
    ':description' => $note,
    ':image_path' => $image,
]);

$insertId = (int)$pdo->lastInsertId();

echo json_encode([
    'success' => true,
    'message' => 'Expense saved successfully.',
    'expense' => [
        'id' => $insertId,
        'name' => $name,
        'amount' => $amount,
        'category' => $category,
        'note' => $note,
        'date' => $date,
        'image' => $image,
    ],
]);
