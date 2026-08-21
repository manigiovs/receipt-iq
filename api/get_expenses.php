<?php


require_once __DIR__ . '/db_connect.php';


if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit;
}


$userId = isset($_GET['user_id']) ? (int)$_GET['user_id'] : 0;


if ($userId <= 0) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'User ID is required.']);
    exit;
}


$pdo = getDbConnection();
$stmt = $pdo->prepare(
    'SELECT id, merchant_name AS name, category, amount, receipt_date AS date, description AS note, image_path AS image
     FROM expenses_tbl
     WHERE user_id = :user_id
     ORDER BY created_at DESC'
);
$stmt->execute([':user_id' => $userId]);
$expenses = $stmt->fetchAll();


foreach ($expenses as &$expense) {
    $expense['amount'] = (float)$expense['amount'];
    if (empty($expense['date'])) {
        $expense['date'] = 'Today';
    }
}

unset($expense);

echo json_encode([
    'success' => true,
    'expenses' => $expenses,
]);
