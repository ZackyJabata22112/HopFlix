USE hopflix;
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE episodes; TRUNCATE TABLE seasons; TRUNCATE TABLE content_genres;
TRUNCATE TABLE favourites; TRUNCATE TABLE watch_history;
TRUNCATE TABLE content; TRUNCATE TABLE genres; TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;

-- ─── Users  ───
INSERT INTO users (id,username,email,password_hash,role) VALUES
(1,'admin',   'admin@hopflix.com', '$2y$10$PLACEHOLDER_ADMIN', 'admin'),
(2,'testuser','test@hopflix.com',  '$2y$10$PLACEHOLDER_USER',  'user');

-- ─── Genres ───────────────────────────────────────────────────
INSERT INTO genres (id,name) VALUES
(1,'Action'),(2,'Adult'),(3,'Adventure'),(4,'Animation'),
(5,'Comedy'),(6,'Crime'),(7,'Drama'),(8,'Family'),
(9,'Fantasy'),(10,'History'),(11,'Horror'),(12,'Medical'),
(13,'Musical'),(14,'Mystery'),(15,'Romance'),(16,'Sci-Fi'),
(17,'Thriller'),(18,'War');

-- ─── Content ──────────────────────────────────────────────────
INSERT INTO content (id,title,type,year,rating,description,cover_url,trailer_url,featured,views) VALUES
-- TV Series
(1,'Amphibia','series',2019,8.1,'A self-centered teenager is transported to Amphibia, a world of frog people.','/images/covers/amphibia.jpg','https://www.youtube.com/embed/TUDpzDSEZ2E',0,1420),
(2,'Gravity Falls','series',2012,8.9,'Twin siblings spend summer at their great-uncle tourist trap in mysterious Gravity Falls.','/images/covers/gravity-falls.jpg','https://www.youtube.com/embed/2-UE94bYEqY',1,3800),
(3,'The Neighbourhood','series',2018,6.8,'A friendly Midwest family moves to a not-so-friendly Los Angeles neighbourhood.','/images/covers/the-neighbourhood.jpg',NULL,0,970),
(4,'Grey''s Anatomy','series',2005,7.6,'Drama centered on surgical interns and supervisors at a Seattle hospital.','/images/covers/greys-anatomy.jpg','https://www.youtube.com/embed/4Yak-NSlR2c',1,5100),
(5,'Helluva Boss','series',2020,8.4,'An imp starts a business specializing in assassinations for souls in Hell.','/images/covers/helluva-boss.jpg','https://www.youtube.com/embed/el_PChGfJN8',1,4200),
(6,'Hazbin Hotel','series',2024,8.0,'Charlie, princess of Hell, opens a hotel to rehabilitate demons.','/images/covers/hazbin-hotel.jpg','https://www.youtube.com/embed/UuZlBFnEfnI',1,4600),
(7,'The Amazing Digital Circus','series',2023,8.6,'Humans trapped in a digital circus struggle to maintain their sanity.','/images/covers/amazing-digital-circus.jpg','https://www.youtube.com/embed/RNElbWREOaI',1,5300),
(8,'Murder Drones','series',2023,8.3,'Murder Drones exterminate Worker Drones on an abandoned planet.','/images/covers/murder-drones.jpg','https://www.youtube.com/embed/qHqhFB9Dgko',0,3100),
(9,'Avatar: The Last Airbender','series',2005,9.3,'A young Avatar must master all four elements to bring peace.','/images/covers/avatar-tla.jpg','https://www.youtube.com/embed/d1EnW4575Os',1,7800),
(10,'Ghosts','series',2021,7.8,'A couple inherits a mansion haunted by ghosts from different eras.','/images/covers/ghosts.jpg','https://www.youtube.com/embed/gRnfBWqMWcE',0,1600),
(11,'The Rookie','series',2018,8.0,'Middle-aged man becomes the oldest rookie at the LAPD.','/images/covers/the-rookie.jpg',NULL,0,2300),
(12,'Arcane','series',2021,9.0,'Origins of two iconic League of Legends champions in Piltover and Zaun.','/images/covers/arcane.jpg','https://www.youtube.com/embed/4Ps6nV4wiCE',1,8200),
(13,'The Last of Us','series',2023,8.8,'Joel smuggles immune Ellie across a post-apocalyptic United States.','/images/covers/the-last-of-us.jpg','https://www.youtube.com/embed/uLtkt8BonwM',1,9100),
(14,'The Walking Dead','series',2010,8.1,'Rick Grimes leads survivors in a zombie apocalypse.','/images/covers/the-walking-dead.jpg','https://www.youtube.com/embed/jAnDAdBYJL4',0,4300),
(15,'Alice in Borderland','series',2020,7.7,'A gamer competes in deadly games in a dystopian Tokyo.','/images/covers/alice-in-borderland.jpg','https://www.youtube.com/embed/9fEpS_JEzvE',1,6400),
(16,'Breaking Bad','series',2008,9.5,'A chemistry teacher turns to cooking meth after a cancer diagnosis.','/images/covers/breaking-bad.jpg','https://www.youtube.com/embed/HhesaQXLuRY',1,12000),
(17,'Stranger Things','series',2016,8.7,'Kids uncover supernatural mysteries in small-town Indiana.','/images/covers/stranger-things.jpg','https://www.youtube.com/embed/b9EkMc79ZSU',1,11000),
(18,'Wednesday','series',2022,8.1,'Wednesday Addams solves mysteries at Nevermore Academy.','/images/covers/wednesday.jpg','https://www.youtube.com/embed/Di310WS8zLk',0,8500),
(19,'One Piece','series',1999,8.9,'Monkey D. Luffy sails the seas to become King of the Pirates.','/images/covers/one-piece.jpg',NULL,0,7200),
(20,'Demon Slayer','series',2019,8.7,'Tanjiro becomes a demon slayer after his family is slaughtered.','/images/covers/demon-slayer.jpg','https://www.youtube.com/embed/VQGCKyvzIM4',1,9300),
(21,'Jujutsu Kaisen','series',2020,8.6,'A student joins a secret organization of sorcerers to kill Curses.','/images/covers/jujutsu-kaisen.jpg','https://www.youtube.com/embed/4A_X-Dvl0ws',0,8800),
(22,'The Bear','series',2022,8.7,'A fine dining chef returns to run his family sandwich shop.','/images/covers/the-bear.jpg','https://www.youtube.com/embed/QywHyWBoHHY',0,5600),
(23,'Succession','series',2018,8.9,'The Roy family fights over control of their media empire.','/images/covers/succession.jpg','https://www.youtube.com/embed/OrmHXXhJpYc',0,6100);

-- Movies
INSERT INTO content (id,title,type,year,rating,description,cover_url,trailer_url,featured,views,duration) VALUES
(101,'The Goat','movie',2023,6.5,'A lighthearted comedy about unexpected encounters.','/images/covers/the-goat.jpg',NULL,0,890,'1h 45m'),
(102,'Inside Out','movie',2015,8.2,'Riley''s emotions conflict as she navigates moving to a new city.','/images/covers/inside-out.jpg','https://www.youtube.com/embed/yRUAzGQ3nSY',1,6700,'1h 35m'),
(103,'Inside Out 2','movie',2024,7.8,'Riley enters adolescence and Anxiety joins her existing emotions.','/images/covers/inside-out-2.jpg','https://www.youtube.com/embed/LEjhY15eCx0',1,7200,'1h 40m'),
(104,'Hoppers','movie',2024,7.0,'An adventure about leaping through unexpected places.','/images/covers/hoppers.jpg',NULL,0,1100,'1h 52m'),
(105,'Hacksaw Ridge','movie',2016,8.2,'WWII conscientious objector Desmond Doss earns the Medal of Honor.','/images/covers/hacksaw-ridge.jpg','https://www.youtube.com/embed/s2-1hz1juBI',1,4100,'2h 19m'),
(106,'The Black Phone','movie',2021,7.4,'An abducted boy uses a disconnected phone to talk with past victims.','/images/covers/the-black-phone.jpg','https://www.youtube.com/embed/4OOK_ynMeJk',0,2800,'1h 43m'),
(107,'Avatar','movie',2009,7.9,'A marine on Pandora becomes torn between orders and protecting his new home.','/images/covers/avatar-1.jpg','https://www.youtube.com/embed/5PSNL1qE6VY',1,8900,'2h 42m'),
(108,'Avatar: The Way of Water','movie',2022,7.6,'Jake Sully and family explore the ocean regions of Pandora.','/images/covers/avatar-2.jpg','https://www.youtube.com/embed/d9MyW72ELq0',0,5600,'3h 12m'),
(109,'Avatar 3','movie',2025,7.8,'The next chapter in the epic Avatar saga continues.','/images/covers/avatar-3.jpg',NULL,1,6900,'2h 58m'),
(110,'Blue Beetle','movie',2023,6.8,'Jaime Reyes bonds with an alien relic that gives him incredible armor.','/images/covers/blue-beetle.jpg','https://www.youtube.com/embed/vS58qM_4bDU',0,2100,'2h 7m'),
(111,'Zootopia','movie',2016,8.0,'A bunny cop and con artist fox uncover a conspiracy in animal city.','/images/covers/zootopia.jpg','https://www.youtube.com/embed/jWM0ct-OLsM',1,5400,'1h 48m'),
(112,'Spider-Man: Across the Spider-Verse','movie',2023,8.7,'Miles Morales catapults across the Multiverse to protect its existence.','/images/covers/spiderman-across.jpg','https://www.youtube.com/embed/cqGjhVJWtEg',1,9500,'2h 20m'),
(113,'Spider-Man: Into the Spider-Verse','movie',2018,8.4,'Teen Miles Morales becomes Spider-Man and meets multiverse counterparts.','/images/covers/spiderman-into.jpg','https://www.youtube.com/embed/tg52up16eq0',1,8700,'1h 57m'),
(114,'Interstellar','movie',2014,8.7,'Explorers travel through a wormhole to ensure humanity''s survival.','/images/covers/interstellar.jpg','https://www.youtube.com/embed/zSWdZVtXT7E',1,9200,'2h 49m'),
(115,'Inception','movie',2010,8.8,'A thief plants an idea into a target''s mind through dream-sharing.','/images/covers/inception.jpg','https://www.youtube.com/embed/YoHD9XEInc0',0,8600,'2h 28m'),
(116,'The Dark Knight','movie',2008,9.0,'Batman faces the Joker''s reign of chaos in Gotham City.','/images/covers/the-dark-knight.jpg','https://www.youtube.com/embed/EXeTwQWrcwY',1,10500,'2h 32m'),
(117,'Dune','movie',2021,8.0,'Paul Atreides leads Fremen in revolt on the desert planet Arrakis.','/images/covers/dune.jpg','https://www.youtube.com/embed/n9xhJrPXop4',0,7400,'2h 35m'),
(118,'Dune: Part Two','movie',2024,8.5,'Paul Atreides wages war against conspirators who destroyed his family.','/images/covers/dune-part-2.jpg','https://www.youtube.com/embed/Way9Dexny3w',1,8100,'2h 46m'),
(119,'Oppenheimer','movie',2023,8.3,'The story of J. Robert Oppenheimer and the atomic bomb.','/images/covers/oppenheimer.jpg','https://www.youtube.com/embed/uYPbbksJxIY',0,7800,'3h'),
(120,'Barbie','movie',2023,6.9,'Barbie and Ken visit the real world and discover joys and perils of humans.','/images/covers/barbie.jpg','https://www.youtube.com/embed/pBk4NYhWNMM',0,6500,'1h 54m');

-- ─── Content Genres ───────────────────────────────────────────
-- Series
INSERT INTO content_genres VALUES (1,4),(1,3),(1,5),(1,8);   -- Amphibia
INSERT INTO content_genres VALUES (2,4),(2,14),(2,5),(2,8);  -- Gravity Falls
INSERT INTO content_genres VALUES (3,5),(3,7);               -- The Neighbourhood
INSERT INTO content_genres VALUES (4,7),(4,15),(4,12);       -- Grey's Anatomy
INSERT INTO content_genres VALUES (5,4),(5,5),(5,11),(5,2);  -- Helluva Boss
INSERT INTO content_genres VALUES (6,4),(6,5),(6,13),(6,2);  -- Hazbin Hotel
INSERT INTO content_genres VALUES (7,4),(7,5),(7,11),(7,9);  -- Digital Circus
INSERT INTO content_genres VALUES (8,4),(8,16),(8,11),(8,1); -- Murder Drones
INSERT INTO content_genres VALUES (9,4),(9,3),(9,9),(9,1);   -- Avatar TLA
INSERT INTO content_genres VALUES (10,5),(10,9);             -- Ghosts
INSERT INTO content_genres VALUES (11,7),(11,6),(11,1);      -- The Rookie
INSERT INTO content_genres VALUES (12,4),(12,1),(12,9),(12,7);-- Arcane
INSERT INTO content_genres VALUES (13,7),(13,11),(13,1),(13,16);-- Last of Us
INSERT INTO content_genres VALUES (14,7),(14,11),(14,1);     -- Walking Dead
INSERT INTO content_genres VALUES (15,1),(15,16),(15,17),(15,7);-- Alice
INSERT INTO content_genres VALUES (16,7),(16,6),(16,17);     -- Breaking Bad
INSERT INTO content_genres VALUES (17,16),(17,11),(17,7),(17,14);-- Stranger Things
INSERT INTO content_genres VALUES (18,5),(18,11),(18,14),(18,9); -- Wednesday
INSERT INTO content_genres VALUES (19,4),(19,3),(19,1),(19,5);   -- One Piece
INSERT INTO content_genres VALUES (20,4),(20,1),(20,9),(20,7);   -- Demon Slayer
INSERT INTO content_genres VALUES (21,4),(21,1),(21,11),(21,9);  -- JJK
INSERT INTO content_genres VALUES (22,7),(22,5);                 -- The Bear
INSERT INTO content_genres VALUES (23,7),(23,5);                 -- Succession
-- Movies
INSERT INTO content_genres VALUES (101,5),(101,7);
INSERT INTO content_genres VALUES (102,4),(102,3),(102,5),(102,8);
INSERT INTO content_genres VALUES (103,4),(103,3),(103,5),(103,8);
INSERT INTO content_genres VALUES (104,3),(104,5);
INSERT INTO content_genres VALUES (105,7),(105,10),(105,18);
INSERT INTO content_genres VALUES (106,11),(106,17),(106,7);
INSERT INTO content_genres VALUES (107,1),(107,3),(107,16),(107,9);
INSERT INTO content_genres VALUES (108,1),(108,3),(108,16),(108,9);
INSERT INTO content_genres VALUES (109,1),(109,3),(109,16),(109,9);
INSERT INTO content_genres VALUES (110,1),(110,3),(110,16);
INSERT INTO content_genres VALUES (111,4),(111,3),(111,5),(111,8);
INSERT INTO content_genres VALUES (112,4),(112,1),(112,3),(112,16);
INSERT INTO content_genres VALUES (113,4),(113,1),(113,3),(113,16);
INSERT INTO content_genres VALUES (114,16),(114,7),(114,3);
INSERT INTO content_genres VALUES (115,16),(115,1),(115,17);
INSERT INTO content_genres VALUES (116,1),(116,6),(116,7);
INSERT INTO content_genres VALUES (117,16),(117,3),(117,7);
INSERT INTO content_genres VALUES (118,16),(118,3),(118,7);
INSERT INTO content_genres VALUES (119,7),(119,10),(119,17);
INSERT INTO content_genres VALUES (120,5),(120,9),(120,3);

-- ─── Seasons & Episodes ───────────
DELIMITER $$
CREATE PROCEDURE gen_eps(IN sid INT, IN cnt INT, IN dur VARCHAR(20))
BEGIN
  DECLARE i INT DEFAULT 1;
  WHILE i<=cnt DO
    INSERT INTO episodes(season_id,episode_number,title,duration) VALUES(sid,i,CONCAT('Episode ',i),dur);
    SET i=i+1;
  END WHILE;
END$$
DELIMITER ;

-- Insert seasons and generate episodes
INSERT INTO seasons(id,content_id,season_number) VALUES(1,1,1),(2,1,2),(3,1,3);
CALL gen_eps(1,20,'23 min'); CALL gen_eps(2,22,'23 min'); CALL gen_eps(3,18,'23 min');

INSERT INTO seasons(id,content_id,season_number) VALUES(4,2,1),(5,2,2);
CALL gen_eps(4,20,'22 min'); CALL gen_eps(5,20,'22 min');

INSERT INTO seasons(id,content_id,season_number) VALUES(6,3,1),(7,3,2);
CALL gen_eps(6,22,'22 min'); CALL gen_eps(7,22,'22 min');

INSERT INTO seasons(id,content_id,season_number) VALUES(8,5,1),(9,5,2);
CALL gen_eps(8,8,'25 min'); CALL gen_eps(9,8,'25 min');

INSERT INTO seasons(id,content_id,season_number) VALUES(10,6,1);
CALL gen_eps(10,8,'30 min');

INSERT INTO seasons(id,content_id,season_number) VALUES(11,7,1);
CALL gen_eps(11,4,'20 min');

INSERT INTO seasons(id,content_id,season_number) VALUES(12,8,1);
CALL gen_eps(12,8,'22 min');

INSERT INTO seasons(id,content_id,season_number) VALUES(13,9,1),(14,9,2),(15,9,3);
CALL gen_eps(13,20,'23 min'); CALL gen_eps(14,20,'23 min'); CALL gen_eps(15,21,'23 min');

INSERT INTO seasons(id,content_id,season_number) VALUES(16,10,1),(17,10,2);
CALL gen_eps(16,18,'22 min'); CALL gen_eps(17,22,'22 min');

INSERT INTO seasons(id,content_id,season_number) VALUES(18,11,1),(19,11,2),(20,11,3);
CALL gen_eps(18,20,'43 min'); CALL gen_eps(19,20,'43 min'); CALL gen_eps(20,14,'43 min');

INSERT INTO seasons(id,content_id,season_number) VALUES(21,12,1),(22,12,2);
CALL gen_eps(21,9,'40 min'); CALL gen_eps(22,9,'40 min');

INSERT INTO seasons(id,content_id,season_number) VALUES(23,13,1),(24,13,2);
CALL gen_eps(23,9,'55 min'); CALL gen_eps(24,7,'55 min');

INSERT INTO seasons(id,content_id,season_number) VALUES(25,15,1),(26,15,2);
CALL gen_eps(25,8,'50 min'); CALL gen_eps(26,8,'50 min');

INSERT INTO seasons(id,content_id,season_number) VALUES(27,16,1),(28,16,2),(29,16,3),(30,16,4),(31,16,5);
CALL gen_eps(27,7,'47 min'); CALL gen_eps(28,13,'47 min'); CALL gen_eps(29,13,'47 min'); CALL gen_eps(30,13,'47 min'); CALL gen_eps(31,16,'47 min');

INSERT INTO seasons(id,content_id,season_number) VALUES(32,17,1),(33,17,2),(34,17,3),(35,17,4);
CALL gen_eps(32,8,'51 min'); CALL gen_eps(33,9,'55 min'); CALL gen_eps(34,8,'52 min'); CALL gen_eps(35,9,'77 min');

INSERT INTO seasons(id,content_id,season_number) VALUES(36,18,1);
CALL gen_eps(36,8,'48 min');

INSERT INTO seasons(id,content_id,season_number) VALUES(37,20,1),(38,20,2),(39,20,3);
CALL gen_eps(37,26,'24 min'); CALL gen_eps(38,18,'24 min'); CALL gen_eps(39,11,'24 min');

INSERT INTO seasons(id,content_id,season_number) VALUES(40,21,1),(41,21,2);
CALL gen_eps(40,24,'24 min'); CALL gen_eps(41,23,'24 min');

INSERT INTO seasons(id,content_id,season_number) VALUES(42,22,1),(43,22,2);
CALL gen_eps(42,8,'30 min'); CALL gen_eps(43,10,'35 min');

INSERT INTO seasons(id,content_id,season_number) VALUES(44,23,1),(45,23,2),(46,23,3),(47,23,4);
CALL gen_eps(44,10,'60 min'); CALL gen_eps(45,10,'60 min'); CALL gen_eps(46,10,'60 min'); CALL gen_eps(47,10,'60 min');

DROP PROCEDURE IF EXISTS gen_eps;

SELECT 'HopFlix seed data loaded! 🐸' AS status;
