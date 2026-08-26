<?php
require_once __DIR__ . '/db_connect.php';

$pdo = getDbConnection();
$pdo->query('SELECT 1');

echo json_encode([
	'success' => true,
	'message' => 'API and database connection are working.',
]);