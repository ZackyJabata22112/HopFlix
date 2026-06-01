<?php
require_once __DIR__ . '/db.php';

header('Content-Type: application/json');

$action = $_GET['action'] ?? '';
$pdo    = getDB();

function fetchContent(PDO $pdo, string $where = '', array $params = [], int $limit = 0): array {
    $sql = "SELECT c.id, c.title, c.type, c.year, c.rating, c.description,
                   c.cover_url, c.trailer_url, c.video_url, c.duration,
                   c.featured, c.views, c.created_at
            FROM content c
            {$where}
            ORDER BY c.id ASC";
    if ($limit > 0) $sql .= " LIMIT " . (int)$limit;

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $rows = $stmt->fetchAll();

    if (empty($rows)) return [];

    $ids = array_column($rows, 'id');
    $placeholders = implode(',', array_fill(0, count($ids), '?'));

    $gStmt = $pdo->prepare(
        "SELECT cg.content_id, g.name FROM content_genres cg
         JOIN genres g ON g.id = cg.genre_id
         WHERE cg.content_id IN ($placeholders)"
    );
    $gStmt->execute($ids);
    $genreMap = [];
    foreach ($gStmt->fetchAll() as $row) {
        $genreMap[$row['content_id']][] = $row['name'];
    }

    $sStmt = $pdo->prepare(
        "SELECT s.id AS season_id, s.content_id, s.season_number,
                e.episode_number, e.title AS ep_title, e.duration AS ep_duration, e.video_url AS ep_video
         FROM seasons s
         LEFT JOIN episodes e ON e.season_id = s.id
         WHERE s.content_id IN ($placeholders)
         ORDER BY s.season_number ASC, e.episode_number ASC"
    );
    $sStmt->execute($ids);
    $seasonMap = [];
    foreach ($sStmt->fetchAll() as $row) {
        $cid = $row['content_id'];
        $sn  = $row['season_number'];
        if (!isset($seasonMap[$cid][$sn])) {
            $seasonMap[$cid][$sn] = ['number' => (int)$sn, 'episodes' => []];
        }
        if ($row['episode_number'] !== null) {
            $seasonMap[$cid][$sn]['episodes'][] = [
                'ep'       => (int)$row['episode_number'],
                'title'    => $row['ep_title'],
                'duration' => $row['ep_duration'],
                'videoSrc' => $row['ep_video'] ?? '',
            ];
        }
    }

    $result = [];
    foreach ($rows as $row) {
        $id = (int)$row['id'];
        $item = [
            'id'          => $id,
            'title'       => $row['title'],
            'type'        => $row['type'],
            'year'        => (int)$row['year'],
            'rating'      => (float)$row['rating'],
            'description' => $row['description'],
            'cover'       => $row['cover_url'],
            'trailer'     => $row['trailer_url'] ?? '',
            'videoSrc'    => $row['video_url'] ?? '',
            'duration'    => $row['duration'] ?? '',
            'featured'    => (bool)$row['featured'],
            'views'       => (int)$row['views'],
            'genres'      => $genreMap[$id] ?? [],
        ];
        if (isset($seasonMap[$id])) {
            $item['seasons'] = array_values($seasonMap[$id]);
        } else {
            $item['seasons'] = [];
        }
        $result[] = $item;
    }
    return $result;
}

switch ($action) {

    case 'all':
        jsonResponse(fetchContent($pdo));
        break;

    case 'movies':
        jsonResponse(fetchContent($pdo, 'WHERE c.type = ?', ['movie']));
        break;

    case 'series':
        jsonResponse(fetchContent($pdo, 'WHERE c.type = ?', ['series']));
        break;

    case 'featured':
        jsonResponse(fetchContent($pdo, 'WHERE c.featured = 1'));
        break;

    case 'trending':
        $limit = max(1, min(50, (int)($_GET['limit'] ?? 10)));
        $sql   = "SELECT c.id FROM content c ORDER BY c.views DESC LIMIT ?";
        $stmt  = $pdo->prepare($sql);
        $stmt->execute([$limit]);
        $ids   = $stmt->fetchAll(PDO::FETCH_COLUMN);
        if (empty($ids)) { jsonResponse([]); }
        $placeholders = implode(',', array_fill(0, count($ids), '?'));
        $items = fetchContent($pdo, "WHERE c.id IN ($placeholders)", $ids);
        usort($items, fn($a, $b) => $b['views'] - $a['views']);
        jsonResponse($items);
        break;

    case 'item':
        $id   = (int)($_GET['id'] ?? 0);
        $rows = fetchContent($pdo, 'WHERE c.id = ?', [$id]);
        if (empty($rows)) {
            jsonResponse(['error' => 'Not found'], 404);
        }
        jsonResponse($rows[0]);
        break;

    case 'search':
        $q = trim($_GET['q'] ?? '');
        if (strlen($q) < 1) { jsonResponse([]); }
        $rows = fetchContent($pdo, 'WHERE c.title LIKE ?', ['%' . $q . '%']);
        jsonResponse($rows);
        break;

    case 'genre':
        $genre = trim($_GET['genre'] ?? '');
        if (!$genre) { jsonResponse([]); }
        $stmt = $pdo->prepare(
            "SELECT cg.content_id FROM content_genres cg
             JOIN genres g ON g.id = cg.genre_id
             WHERE g.name = ?"
        );
        $stmt->execute([$genre]);
        $ids = $stmt->fetchAll(PDO::FETCH_COLUMN);
        if (empty($ids)) { jsonResponse([]); }
        $placeholders = implode(',', array_fill(0, count($ids), '?'));
        jsonResponse(fetchContent($pdo, "WHERE c.id IN ($placeholders)", $ids));
        break;

    case 'similar':
        $id    = (int)($_GET['id'] ?? 0);
        $limit = max(1, min(20, (int)($_GET['limit'] ?? 6)));
        $stmt = $pdo->prepare(
            "SELECT g.name FROM content_genres cg JOIN genres g ON g.id = cg.genre_id WHERE cg.content_id = ?"
        );
        $stmt->execute([$id]);
        $genres = $stmt->fetchAll(PDO::FETCH_COLUMN);
        if (empty($genres)) { jsonResponse([]); }
        $gPlaceholders = implode(',', array_fill(0, count($genres), '?'));
        $stmt2 = $pdo->prepare(
            "SELECT DISTINCT cg.content_id FROM content_genres cg
             JOIN genres g ON g.id = cg.genre_id
             WHERE g.name IN ($gPlaceholders) AND cg.content_id != ?
             LIMIT 50"
        );
        $stmt2->execute(array_merge($genres, [$id]));
        $similarIds = $stmt2->fetchAll(PDO::FETCH_COLUMN);
        if (empty($similarIds)) { jsonResponse([]); }
        $placeholders = implode(',', array_fill(0, count($similarIds), '?'));
        $items = fetchContent($pdo, "WHERE c.id IN ($placeholders)", $similarIds);
        usort($items, fn($a, $b) => $b['views'] - $a['views']);
        jsonResponse(array_slice($items, 0, $limit));
        break;

    case 'genres':
        $stmt = $pdo->query('SELECT name FROM genres ORDER BY name ASC');
        jsonResponse($stmt->fetchAll(PDO::FETCH_COLUMN));
        break;

    case 'view':
        $id = (int)($_GET['id'] ?? 0);
        if ($id > 0) {
            $pdo->prepare('UPDATE content SET views = views + 1 WHERE id = ?')->execute([$id]);
        }
        jsonResponse(['ok' => true]);
        break;

    case 'add':
        requireAdmin();
        $body     = jsonBody();
        $title    = trim($body['title'] ?? '');
        $type     = in_array($body['type'] ?? '', ['movie','series']) ? $body['type'] : null;
        $year     = (int)($body['year'] ?? 0);
        $rating   = (float)($body['rating'] ?? 0);
        $desc     = trim($body['description'] ?? '');
        $cover    = trim($body['cover'] ?? '/HopFlix/images/covers/placeholder.jpg');
        $trailer  = trim($body['trailer'] ?? '');
        $featured = !empty($body['featured']) ? 1 : 0;
        $views    = max(0, (int)($body['views'] ?? 100));
        $duration = trim($body['duration'] ?? '');
        $genres   = $body['genres'] ?? [];
        $seasons  = $body['seasons'] ?? [];

        if (!$title || !$type || $year < 1900 || $rating < 0 || $rating > 10 || !$desc || empty($genres)) {
            jsonResponse(['error' => 'Missing or invalid required fields.'], 400);
        }

        $pdo->beginTransaction();
        try {
            $ins = $pdo->prepare(
                'INSERT INTO content (title, type, year, rating, description, cover_url, trailer_url, featured, views, duration)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
            );
            $ins->execute([$title, $type, $year, $rating, $desc, $cover, $trailer ?: null, $featured, $views, $duration ?: null]);
            $contentId = (int)$pdo->lastInsertId();

            foreach ($genres as $gname) {
                $gname = trim($gname);
                if (!$gname) continue;
                $chk = $pdo->prepare('SELECT id FROM genres WHERE name = ?');
                $chk->execute([$gname]);
                $gid = $chk->fetchColumn();
                if (!$gid) {
                    $pdo->prepare('INSERT INTO genres (name) VALUES (?)')->execute([$gname]);
                    $gid = (int)$pdo->lastInsertId();
                }
                $pdo->prepare('INSERT IGNORE INTO content_genres (content_id, genre_id) VALUES (?, ?)')->execute([$contentId, $gid]);
            }

            foreach ($seasons as $season) {
                $sn = (int)($season['number'] ?? 0);
                if ($sn < 1) continue;
                $sinc = $pdo->prepare('INSERT INTO seasons (content_id, season_number) VALUES (?, ?)');
                $sinc->execute([$contentId, $sn]);
                $seasonId = (int)$pdo->lastInsertId();
                foreach ($season['episodes'] ?? [] as $ep) {
                    $epNum  = (int)($ep['ep'] ?? 0);
                    $epTitle = $ep['title'] ?? "Episode {$epNum}";
                    $epDur  = $ep['duration'] ?? '42 min';
                    $pdo->prepare(
                        'INSERT INTO episodes (season_id, episode_number, title, duration) VALUES (?, ?, ?, ?)'
                    )->execute([$seasonId, $epNum, $epTitle, $epDur]);
                }
            }

            $pdo->commit();
            jsonResponse(['ok' => true, 'id' => $contentId], 201);
        } catch (Exception $e) {
            $pdo->rollBack();
            jsonResponse(['error' => 'Failed to add content: ' . $e->getMessage()], 500);
        }
        break;

    case 'delete':
        requireAdmin();
        $body = jsonBody();
        $id   = (int)($body['id'] ?? $_GET['id'] ?? 0);
        if (!$id) {
            jsonResponse(['error' => 'ID required'], 400);
        }
        $pdo->prepare('DELETE FROM content WHERE id = ?')->execute([$id]);
        jsonResponse(['ok' => true]);
        break;

    default:
        jsonResponse(['error' => 'Unknown action'], 400);
}
