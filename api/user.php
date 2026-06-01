<?php
require_once __DIR__ . '/db.php';

header('Content-Type: application/json');

$action = $_GET['action'] ?? '';
$pdo    = getDB();

switch ($action) {
    case 'favourites':
        requireLogin();
        $uid  = sessionUserId();
        $stmt = $pdo->prepare(
            'SELECT content_id FROM favourites WHERE user_id = ? ORDER BY added_at DESC'
        );
        $stmt->execute([$uid]);
        $ids = $stmt->fetchAll(PDO::FETCH_COLUMN);
        jsonResponse(['ids' => array_map('intval', $ids)]);
        break;

    case 'favourite_toggle':
        requireLogin();
        $uid  = sessionUserId();
        $body = jsonBody();
        $cid  = (int)($body['content_id'] ?? 0);
        if (!$cid) jsonResponse(['error' => 'content_id required'], 400);

        $chk = $pdo->prepare('SELECT 1 FROM favourites WHERE user_id = ? AND content_id = ?');
        $chk->execute([$uid, $cid]);
        $exists = $chk->fetchColumn();

        if ($exists) {
            $pdo->prepare('DELETE FROM favourites WHERE user_id = ? AND content_id = ?')->execute([$uid, $cid]);
            jsonResponse(['added' => false]);
        } else {
            $pdo->prepare('INSERT IGNORE INTO favourites (user_id, content_id) VALUES (?, ?)')->execute([$uid, $cid]);
            jsonResponse(['added' => true]);
        }
        break;

    case 'history':
        requireLogin();
        $uid  = sessionUserId();
        $stmt = $pdo->prepare(
            'SELECT content_id, progress, watched_at FROM watch_history
             WHERE user_id = ? ORDER BY watched_at DESC'
        );
        $stmt->execute([$uid]);
        $rows = $stmt->fetchAll();
        $result = array_map(fn($r) => [
            'id'        => (int)$r['content_id'],
            'progress'  => (int)$r['progress'],
            'watchedAt' => strtotime($r['watched_at']) * 1000,
        ], $rows);
        jsonResponse($result);
        break;

    case 'history_add':
        requireLogin();
        $uid  = sessionUserId();
        $body = jsonBody();
        $cid  = (int)($body['content_id'] ?? 0);
        $prog = max(0, min(100, (int)($body['progress'] ?? 0)));
        if (!$cid) jsonResponse(['error' => 'content_id required'], 400);

        $pdo->prepare(
            'INSERT INTO watch_history (user_id, content_id, progress)
             VALUES (?, ?, ?)
             ON DUPLICATE KEY UPDATE progress = ?, watched_at = CURRENT_TIMESTAMP'
        )->execute([$uid, $cid, $prog, $prog]);

        jsonResponse(['ok' => true]);
        break;

    case 'list':
        requireAdmin();
        $stmt = $pdo->query(
            'SELECT id, username, email, role, DATE(created_at) AS joinDate FROM users ORDER BY id ASC'
        );
        $users = array_map(fn($u) => [
            'id'       => (int)$u['id'],
            'username' => $u['username'],
            'email'    => $u['email'],
            'role'     => $u['role'],
            'joinDate' => $u['joinDate'],
        ], $stmt->fetchAll());
        jsonResponse($users);
        break;

    case 'delete':
        requireAdmin();
        $body = jsonBody();
        $uid  = (int)($body['id'] ?? 0);
        if (!$uid) jsonResponse(['error' => 'id required'], 400);
        if ($uid === sessionUserId()) jsonResponse(['error' => 'Cannot delete yourself'], 400);
        $chk = $pdo->prepare('SELECT role FROM users WHERE id = ?');
        $chk->execute([$uid]);
        $target = $chk->fetch();
        if (!$target) jsonResponse(['error' => 'User not found'], 404);
        if ($target['role'] === 'admin') jsonResponse(['error' => 'Cannot delete admin accounts'], 403);
        $pdo->prepare('DELETE FROM users WHERE id = ?')->execute([$uid]);
        jsonResponse(['ok' => true]);
        break;

    default:
        jsonResponse(['error' => 'Unknown action'], 400);
}
