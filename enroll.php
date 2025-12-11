<?php
// enroll.php
// Accepts JSON POST with name, phone, email, note and appends to enroll.txt
header('Content-Type: application/json');

// Read input (support JSON body or form-encoded for flexibility)
$input = file_get_contents('php://input');
$data = [];
if($input){
    $decoded = json_decode($input, true);
    if(json_last_error() === JSON_ERROR_NONE && is_array($decoded)){
        $data = $decoded;
    }
}
// fallback to $_POST if no JSON provided
if(!$data){
    $data = $_POST;
}

// Basic validation
$name = isset($data['name']) ? trim($data['name']) : '';
$phone = isset($data['phone']) ? trim($data['phone']) : '';
$email = isset($data['email']) ? trim($data['email']) : '';
$note = isset($data['note']) ? trim($data['note']) : '';

if($name === '' || $phone === ''){
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Name and phone are required.']);
    exit;
}

// sanitize fields
function sanitize($s){
    $s = strip_tags($s);
    $s = preg_replace('/[\r\n]+/',' ', $s); // remove newlines
    $s = trim($s);
    return $s;
}

$record = [
    'timestamp' => date('c'),
    'ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown',
    'name' => sanitize($name),
    'phone' => sanitize($phone),
    'email' => sanitize($email),
    'note' => sanitize($note)
];

$line = json_encode($record, JSON_UNESCAPED_UNICODE) . PHP_EOL;
$file = __DIR__ . DIRECTORY_SEPARATOR . 'enroll.txt';

$res = file_put_contents($file, $line, FILE_APPEND | LOCK_EX);
if($res === false){
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to save enrollment.']);
    exit;
}

echo json_encode(['success' => true, 'message' => 'Enrollment saved. Thank you!']);
