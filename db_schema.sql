CREATE DATABASE IF NOT EXISTS team7_db;
use team7_db;

-- USER 테이블
CREATE TABLE USER (
  id VARCHAR(255) PRIMARY KEY,
  nickname VARCHAR(255),
  password VARCHAR(255)
);

-- GROUP 테이블
CREATE TABLE `GROUP` (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255),
  imageUrl VARCHAR(255),
  introduction TEXT,
  postCount INT,
  createdAt DATETIME,
  memberCount INT
  
);

-- POST 테이블
CREATE TABLE POST (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId VARCHAR(255),
  groupId INT,
  title VARCHAR(255),
  content TEXT,
  imageUrl VARCHAR(255),
  isPublic BOOLEAN,
  location VARCHAR(255),
  moment DATETIME,
  likeCount INT,
  commentCount INT,
  createdAt DATETIME,
  FOREIGN KEY (userId) REFERENCES USER(id),
  FOREIGN KEY (groupId) REFERENCES `GROUP`(id)
);

-- PARTICIPATE 테이블
CREATE TABLE PARTICIPATE (
  userId VARCHAR(255),
  groupId INT,
  PRIMARY KEY (userId, groupId),
  FOREIGN KEY (userId) REFERENCES USER(id),
  FOREIGN KEY (groupId) REFERENCES `GROUP`(id)
);

-- COMMENT 테이블
CREATE TABLE COMMENT (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId VARCHAR(255),
  content TEXT,
  postId INT,
  createdAt DATETIME,
  FOREIGN KEY (userId) REFERENCES USER(id),
  FOREIGN KEY (postId) REFERENCES POST(id)
);

-- SCRAP 테이블
CREATE TABLE SCRAP (
  userId VARCHAR(255),
  postId INT,
  PRIMARY KEY (userId, postId),
  FOREIGN KEY (userId) REFERENCES USER(id),
  FOREIGN KEY (postId) REFERENCES POST(id)
);

-- LIKE 테이블
CREATE TABLE `LIKE` (
  userId VARCHAR(255),
  postId INT,
  PRIMARY KEY (userId, postId),
  FOREIGN KEY (userId) REFERENCES USER(id),
  FOREIGN KEY (postId) REFERENCES POST(id)
);
