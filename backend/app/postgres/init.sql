set time zone 'UTC-3';


CREATE TABLE users (
  uuid SERIAL PRIMARY KEY,
  sex INTEGER NOT NULL,
  username VARCHAR(16) NOT NULL,
  password VARCHAR(32) NOT NULL,
  email VARCHAR(32) NOT NULL,
  withMeets VARCHAR(32) NOT NULL,
  targetMeet VARCHAR(32) NOT NULL,
  targetHeight VARCHAR(32) NOT NULL,
  targetFat VARCHAR(32) NOT NULL,
  birthDay VARCHAR(32) NOT NULL,
  liked VARCHAR(255) DEFAULT '',
  aboutUser VARCHAR(999) DEFAULT 'Тут пока пусто...',
  linkToIMG VARCHAR(9999) DEFAULT 'https://belon.club/uploads/posts/2023-04/1681515046_belon-club-p-bezlikoe-litso-instagram-6.png'
);

CREATE TABLE messages (
  mid SERIAL PRIMARY KEY,
  from_uuid INTEGER NOT NULL,
  to_uuid INTEGER NOT NULL,
  text VARCHAR(99999),
  clock TIMESTAMP DEFAULT now(),
  is_read BOOLEAN DEFAULT '0'
);
--test users
INSERT INTO users (sex, username, password, email, withMeets, targetMeet, targetHeight, targetFat, birthDay, liked, aboutUser) VALUES ('1', 'Test1', '123', 'Test1@test.ru', '1', 'Test meet', '185', '65', '23.12.2002', '', 'Sample TEXT');
INSERT INTO users (sex, username, password, email, withMeets, targetMeet, targetHeight, targetFat, birthDay, liked, aboutUser) VALUES ('0', 'Test2', '123', 'Test2@test.ru', '1', 'Test meet', '185', '65', '23.12.2002', '', 'Sample TEXT');
INSERT INTO users (sex, username, password, email, withMeets, targetMeet, targetHeight, targetFat, birthDay, liked, aboutUser) VALUES ('1', 'Test3', '123', 'Test3@test.ru', '1', 'Test meet', '185', '65', '23.12.2002', '', 'Sample TEXT');
INSERT INTO users (sex, username, password, email, withMeets, targetMeet, targetHeight, targetFat, birthDay, liked, aboutUser) VALUES ('0', 'Test4', '123', 'Test4@test.ru', '1', 'Test meet', '185', '65', '23.12.2002', '', 'Sample TEXT');
INSERT INTO users (sex, username, password, email, withMeets, targetMeet, targetHeight, targetFat, birthDay, liked, aboutUser) VALUES ('1', 'Test5', '123', 'Test5@test.ru', '1', 'Test meet', '185', '65', '23.12.2002', '', 'Sample TEXT');

--test messages
INSERT INTO messages (from_uuid, to_uuid, text) VALUES ('1','2','Привет!');
INSERT INTO messages (from_uuid, to_uuid, text) VALUES ('2','1','Эх, черчиль 3!..');
INSERT INTO messages (from_uuid, to_uuid, text) VALUES ('1','2','Эх...');