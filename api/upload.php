<?php
require_once __DIR__ . '/db.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['error' => 'POST only'], 405);
}

requireLogin();
$uid  = sessionUserId();
$type = $_GET['type'] ?? '';

if (!in_array($type, ['avatar', 'banner'])) {
    jsonResponse(['error' => 'Invalid type'], 400);
}

if (empty($_FILES['file'])) {
    jsonResponse(['error' => 'No file uploaded'], 400);
}

$file     = $_FILES['file'];
$mimeType = mime_content_type($file['tmp_name']);
$allowed  = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

if (!in_array($mimeType, $allowed)) {
    jsonResponse(['error' => 'Only JPEG, PNG, GIF and WebP allowed'], 400);
}

$pdo  = getDB();
$stmt = $pdo->prepare('SELECT username FROM users WHERE id = ?');
$stmt->execute([$uid]);
$row  = $stmt->fetch();
$username = $row ? preg_replace('/[^a-z0-9_\-]/i', '_', $row['username']) : (string)$uid;

$ext = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/gif' => 'gif', 'image/webp' => 'webp'][$mimeType];

if ($type === 'avatar') {
    $subDir  = 'avatars/' . $username;
    $fname   = 'avatar.' . $ext;
} else {
    $subDir  = 'banners/' . $username;
    $fname   = 'banner.' . $ext;
}

$dir  = __DIR__ . '/../user-info/' . $subDir . '/';
$dest = $dir . $fname;

if (!is_dir($dir)) {
    mkdir($dir, 0755, true);
}

if (!move_uploaded_file($file['tmp_name'], $dest)) {
    jsonResponse(['error' => 'Failed to save file'], 500);
}

$urlPath = '/HopFlix/user-info/' . $subDir . '/' . $fname;

$col = $type === 'avatar' ? 'avatar_url' : 'banner_url';
$pdo->prepare("UPDATE users SET {$col} = ? WHERE id = ?")->execute([$urlPath, $uid]);

jsonResponse(['ok' => true, 'url' => $urlPath]);
