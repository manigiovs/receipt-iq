<?php

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Accept, Content-Type');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
	http_response_code(204);
	exit;
}



const DB_HOST = '127.0.0.1';
const DB_NAME = 'receipt_iq_db';
const DB_USER = 'root';
const DB_PASS = '';
const DB_CHARSET = 'utf8mb4';

// Override these with server environment variables in production hosting.
define('RECEIPT_IQ_DB_HOST', getenv('RECEIPT_IQ_DB_HOST') ?: DB_HOST);
define('RECEIPT_IQ_DB_NAME', getenv('RECEIPT_IQ_DB_NAME') ?: DB_NAME);
define('RECEIPT_IQ_DB_USER', getenv('RECEIPT_IQ_DB_USER') ?: DB_USER);
define('RECEIPT_IQ_DB_PASS', getenv('RECEIPT_IQ_DB_PASS') ?: DB_PASS);
error_reporting(E_ALL);
ini_set('display_errors', '0');
