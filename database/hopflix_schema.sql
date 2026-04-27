

CREATE DATABASE IF NOT EXISTS hopflix CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE hopflix;

-- ─── users ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id            INT           AUTO_INCREMENT PRIMARY KEY,
  username      VARCHAR(30)   NOT NULL UNIQUE,
  email         VARCHAR(255)  NOT NULL UNIQUE,
  password_hash VARCHAR(255)  NOT NULL,   -- bcrypt hash, NEVER store plain text
  role          ENUM('user','admin') NOT NULL DEFAULT 'user',
  avatar_url    VARCHAR(500)  NULL,
  banner_url    VARCHAR(500)  NULL,
  created_at    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email)
) ENGINE=InnoDB;

-- ─── content ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS content (
  id            INT           AUTO_INCREMENT PRIMARY KEY,
  title         VARCHAR(255)  NOT NULL,
  type          ENUM('movie','series') NOT NULL,
  year          SMALLINT      NOT NULL,
  rating        DECIMAL(3,1)  NOT NULL DEFAULT 0.0,
  description   TEXT          NOT NULL,
  cover_url     VARCHAR(500)  NOT NULL DEFAULT '/images/covers/placeholder.jpg',
  trailer_url   VARCHAR(500)  NULL,
  video_url     VARCHAR(500)  NULL,       -- main video file (movies) or episode 1 fallback
  duration      VARCHAR(20)   NULL,       -- movies only e.g. "2h 15m"
  featured      TINYINT(1)    NOT NULL DEFAULT 0,
  views         INT           NOT NULL DEFAULT 0,
  created_at    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_type    (type),
  INDEX idx_featured(featured),
  FULLTEXT INDEX ft_title (title)
) ENGINE=InnoDB;

-- ─── genres ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS genres (
  id    INT         AUTO_INCREMENT PRIMARY KEY,
  name  VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB;

-- ─── content_genres ───────────────────────
CREATE TABLE IF NOT EXISTS content_genres (
  content_id INT NOT NULL,
  genre_id   INT NOT NULL,
  PRIMARY KEY (content_id, genre_id),
  FOREIGN KEY (content_id) REFERENCES content(id) ON DELETE CASCADE,
  FOREIGN KEY (genre_id)   REFERENCES genres(id)  ON DELETE CASCADE
) ENGINE=InnoDB;

-- ─── seasons ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS seasons (
  id            INT            AUTO_INCREMENT PRIMARY KEY,
  content_id    INT            NOT NULL,
  season_number TINYINT        NOT NULL,
  FOREIGN KEY (content_id) REFERENCES content(id) ON DELETE CASCADE,
  UNIQUE KEY uq_content_season (content_id, season_number)
) ENGINE=InnoDB;

-- ─── episodes ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS episodes (
  id             INT          AUTO_INCREMENT PRIMARY KEY,
  season_id      INT          NOT NULL,
  episode_number SMALLINT     NOT NULL,
  title          VARCHAR(255) NOT NULL,
  duration       VARCHAR(20)  NOT NULL DEFAULT '23 min',
  video_url      VARCHAR(500) NULL,
  FOREIGN KEY (season_id) REFERENCES seasons(id) ON DELETE CASCADE,
  UNIQUE KEY uq_season_ep (season_id, episode_number)
) ENGINE=InnoDB;

-- ─── watch_history ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS watch_history (
  id          INT  AUTO_INCREMENT PRIMARY KEY,
  user_id     INT  NOT NULL,
  content_id  INT  NOT NULL,
  progress    TINYINT UNSIGNED NOT NULL DEFAULT 0,  -- 0-100%
  watched_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id)    REFERENCES users(id)   ON DELETE CASCADE,
  FOREIGN KEY (content_id) REFERENCES content(id) ON DELETE CASCADE,
  UNIQUE KEY uq_user_content (user_id, content_id)
) ENGINE=InnoDB;

-- ─── favourites ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS favourites (
  user_id    INT       NOT NULL,
  content_id INT       NOT NULL,
  added_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, content_id),
  FOREIGN KEY (user_id)    REFERENCES users(id)   ON DELETE CASCADE,
  FOREIGN KEY (content_id) REFERENCES content(id) ON DELETE CASCADE
) ENGINE=InnoDB;

SELECT 'HopFlix schema created successfully!' AS status;
