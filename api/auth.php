<?php
require_once __DIR__ . '/db.php';

header('Content-Type: application/json');

$action = $_GET['action'] ?? '';

switch ($action) {
    case 'me':
        $uid = sessionUserId();
        if (!$uid) {
            jsonResponse(['user' => null]);
        }
        $pdo  = getDB();
        $stmt = $pdo->prepare('SELECT id, username, email, role, avatar_url, banner_url, created_at FROM users WHERE id = ?');
        $stmt->execute([$uid]);
        $user = $stmt->fetch();
        if (!$user) {
            session_destroy();
            jsonResponse(['user' => null]);
        }
        jsonResponse(['user' => [
            'id'       => (int)$user['id'],
            'username' => $user['username'],
            'email'    => $user['email'],
            'role'     => $user['role'],
            'avatar'   => $user['avatar_url'],
            'banner'   => $user['banner_url'],
            'joinDate' => substr($user['created_at'], 0, 10),
        ]]);
        break;

    case 'login':
        $body  = jsonBody();
        $email = trim($body['email'] ?? '');
        $pass  = $body['password'] ?? '';

        if (!$email || !$pass) {
            jsonResponse(['error' => 'Email and password are required.'], 400);
        }

        $pdo  = getDB();
        $stmt = $pdo->prepare('SELECT id, username, email, role, password, avatar_url, created_at FROM users WHERE email = ?');
        $stmt->execute([strtolower($email)]);
        $user = $stmt->fetch();

        if (!$user || $pass !== $user['password']) {
            jsonResponse(['error' => 'Incorrect email or password.'], 401);
        }

        $_SESSION['user_id']   = (int)$user['id'];
        $_SESSION['user_role'] = $user['role'];

        jsonResponse(['user' => [
            'id'       => (int)$user['id'],
            'username' => $user['username'],
            'email'    => $user['email'],
            'role'     => $user['role'],
            'avatar'   => $user['avatar_url'],
            'joinDate' => substr($user['created_at'], 0, 10),
        ]]);
        break;

    case 'signup':
        $body     = jsonBody();
        $username = trim($body['username'] ?? '');
        $email    = strtolower(trim($body['email'] ?? ''));
        $pass     = $body['password'] ?? '';

        if (!$username || !$email || !$pass) {
            jsonResponse(['error' => 'All fields are required.'], 400);
        }
        if (strlen($username) < 3) {
            jsonResponse(['error' => 'Username must be at least 3 characters.'], 400);
        }
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            jsonResponse(['error' => 'Invalid email address.'], 400);
        }
        if (strlen($pass) < 8) {
            jsonResponse(['error' => 'Password must be at least 8 characters.'], 400);
        }

        $pdo = getDB();

        $stmt = $pdo->prepare('SELECT id FROM users WHERE email = ? OR username = ?');
        $stmt->execute([$email, $username]);
        $existing = $stmt->fetch();
        if ($existing) {
            $chkEmail = $pdo->prepare('SELECT id FROM users WHERE email = ?');
            $chkEmail->execute([$email]);
            if ($chkEmail->fetch()) {
                jsonResponse(['error' => 'Email is already registered.'], 409);
            }
            jsonResponse(['error' => 'Username is already taken.'], 409);
        }

        $ins = $pdo->prepare('INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, \'user\')');
        $ins->execute([$username, $email, $pass]);
        $newId = (int)$pdo->lastInsertId();

        $_SESSION['user_id']   = $newId;
        $_SESSION['user_role'] = 'user';

        jsonResponse(['user' => [
            'id'       => $newId,
            'username' => $username,
            'email'    => $email,
            'role'     => 'user',
            'avatar'   => null,
            'joinDate' => date('Y-m-d'),
        ]], 201);
        break;

    case 'logout':
        session_destroy();
        jsonResponse(['ok' => true]);
        break;

    case 'update':
        requireLogin();
        $uid  = sessionUserId();
        $body = jsonBody();

        $username = trim($body['username'] ?? '');
        $email    = strtolower(trim($body['email'] ?? ''));
        $oldPass  = $body['old_password'] ?? '';
        $newPass  = $body['new_password'] ?? '';

        if (!$username || !$email) {
            jsonResponse(['error' => 'Username and email are required.'], 400);
        }
        if (strlen($username) < 3) {
            jsonResponse(['error' => 'Username must be at least 3 characters.'], 400);
        }

        $pdo  = getDB();
        $stmt = $pdo->prepare('SELECT password FROM users WHERE id = ?');
        $stmt->execute([$uid]);
        $row = $stmt->fetch();

        if ($newPass) {
            if (!$oldPass) {
                jsonResponse(['error' => 'Current password required to change password.'], 400);
            }
            if ($oldPass !== $row['password']) {
                jsonResponse(['error' => 'Current password is incorrect.'], 401);
            }
            if (strlen($newPass) < 8) {
                jsonResponse(['error' => 'New password must be at least 8 characters.'], 400);
            }
            $pdo->prepare('UPDATE users SET password = ? WHERE id = ?')->execute([$newPass, $uid]);
        }

        $pdo->prepare('UPDATE users SET username = ?, email = ? WHERE id = ?')->execute([$username, $email, $uid]);

        jsonResponse(['ok' => true, 'username' => $username, 'email' => $email]);
        break;

    case 'avatar':
        requireLogin();
        $uid  = sessionUserId();
        $body = jsonBody();
        $url  = $body['avatar_url'] ?? null;
        getDB()->prepare('UPDATE users SET avatar_url = ? WHERE id = ?')->execute([$url, $uid]);
        jsonResponse(['ok' => true]);
        break;

    case 'banner':
        requireLogin();
        $uid  = sessionUserId();
        $body = jsonBody();
        $url  = $body['banner_url'] ?? null;
        getDB()->prepare('UPDATE users SET banner_url = ? WHERE id = ?')->execute([$url, $uid]);
        jsonResponse(['ok' => true]);
        break;

    default:
        jsonResponse(['error' => 'Unknown action'], 400);
}
