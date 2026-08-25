<?php
require_once __DIR__ . '/db_connect.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
if (!is_array($data)) { $data = $_POST; }

$id     = isset($data['id']) ? (int)$data['id'] : 0;
$userId = isset($data['user_id']) ? (int)$data['user_id'] : 0;

if ($id <= 0 || $userId <= 0) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Expense id and user id are required.']);
    exit;
}

$name     = trim((string)($data['name'] ?? ''));
$category = trim((string)($data['category'] ?? ''));
$note     = trim((string)($data['note'] ?? ''));

$amountRaw = $data['amount'] ?? '';
$amount    = (float)preg_replace('/[^0-9.]/', '', (string)$amountRaw);

if ($name === '' || $amount <= 0) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Name and a valid amount are required.']);
    exit;
}

$dateRaw = trim((string)($data['date'] ?? ''));
$date    = date('Y-m-d');

foreach (['Y-m-d', 'F j, Y', 'M j, Y'] as $format) {
    $parsed = DateTime::createFromFormat($format, $dateRaw);
    if ($parsed) { $date = $parsed->format('Y-m-d'); break; }
}

$pdo  = getDbConnection();
$stmt = $pdo->prepare(
    'UPDATE expenses_tbl
     SET merchant_name = :name,
         category      = :category,
         amount        = :amount,
         description   = :note,
         receipt_date  = :date
     WHERE id = :id AND user_id = :user_id'
);

$stmt->execute([
    ':name'     => $name,
    ':category' => $category,
    ':amount'   => number_format($amount, 2, '.', ''),
    ':note'     => $note,
    ':date'     => $date,
    ':id'       => $id,
    ':user_id'  => $userId,
]);

if ($stmt->rowCount() === 0) {
    http_response_code(404);
    echo json_encode(['success' => false, 'message' => 'Expense not found or not yours.']);
    exit;
}


echo json_encode([
    'success' => true,
    'message' => 'Expense updated.',
    'expense' => [
        'id'       => $id,
        'name'     => $name,
        'category' => $category,
        'amount'   => $amount,
        'note'     => $note,
        'date'     => $date,
    ],
]);
