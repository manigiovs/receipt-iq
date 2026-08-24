<?php

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Accept, Content-Type');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
	http_response_code(204);
	exit;
}



const DB_HOST = '127.0.0.1';
const DB_NAME = 'receipt_iq_db';
const DB_USER = 'receiptiq';
const DB_PASS = 'ReceiptIQ2026';
const DB_CHARSET = 'utf8mb4';
error_reporting(E_ALL);
ini_set('display_errors', '0');
