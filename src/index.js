const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const mysql = require("mysql2/promise");
const cors = require("cors");
require("dotenv").config();  // .env 파일에서 환경 변수 로드

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: ["http://jogakzip7.s3-website-us-east-1.amazonaws.com", "http://localhost:5173"], // S3 URL 허용
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));

app.use(bodyParser.json()); // JSON 요청파싱

// MySQL 연결 설정
async function connectDB() {
  try {
    const db = await mysql.createConnection({
      host: process.env.DATABASE_HOST,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_DBNAME,
      port: process.env.DATABASE_PORT
    });
    console.log("Connected to the database!");
    return db; // 연결된 db 객체 반환
  } catch (err) {
    console.error("Database connection failed:", err);
    process.exit(1); // 연결 실패 시 프로세스 종료
  }
}

// db사용
(async () => {
  const db = await connectDB(); // DB 연결 완료

  // 메인 화면 라우트 연결
  const readGroupRoutes = require("./routes/group/readGroup")(db);
  app.use("/", readGroupRoutes);

  // signUp 라우트 연결
  const signUpRoutes = require("./routes/user/signUp")(db);
  app.use("/", signUpRoutes);

  // signIn 라우트 연결
  const signInRoutes=require ("./routes/user/signIn")(db);
  app.use("/",signInRoutes);

  // signOut 라우트 연결
  const signOutRoutes= require ("./routes/user/signOut")(db);
  app.use("/",signOutRoutes);

  // deleteUser 라우트 연결
  const deleteUserRoutes = require("./routes/user/deleteUser")(db);
  app.use("/", deleteUserRoutes);

  // myGroups 라우트 연결
  const myGroupsRoutes = require("./routes/user/myGroups")(db);
  app.use("/", myGroupsRoutes);

  // myScraps 라우트 연결
  const myScrapsRoutes = require("./routes/user/myScraps")(db);
  app.use("/", myScrapsRoutes);

  // createGroup 라우트 연결
  const createGroupRoutes = require("./routes/group/createGroup")(db);
  app.use("/groups", createGroupRoutes);

  // updateGroup 라우트 연결
  const updateGroupRoutes = require("./routes/group/updateGroup")(db);
  app.use("/groups", updateGroupRoutes);

  // deleteGroup 라우트 연결
  const deleteGroupRoutes = require("./routes/group/deleteGroup")(db);
  app.use("/groups", deleteGroupRoutes);

  // detailGroup 라우트 연결
  const detailGroupRoutes = require("./routes/group/detailGroup")(db);
  app.use("/groups", detailGroupRoutes);

  // joinGroup 라우트 연결
  const joinGroupRoutes = require("./routes/group/joinGroup")(db);
  app.use("/groups", joinGroupRoutes);

  // leaveGroup 라우트 연결
  const leaveGroupRoutes = require("./routes/group/leaveGroup")(db);
  app.use("/groups", leaveGroupRoutes);

  // createPost 라우트 연결 (게시글 등록)
  const createPostRoutes = require("./routes/post/createPost")(db);
  app.use("/groups", createPostRoutes);

  // readPost 라우트 연결 (게시글 목록 조회)
  const readPostRoutes = require("./routes/post/readPost")(db);
  app.use("/groups", readPostRoutes);

  // updatepost 라우트 연결 (게시글 수정)
  const updatepostRoutes = require("./routes/post/updatePost")(db);
  app.use("/posts",updatepostRoutes);

  // deletepost 라우트 연결 (게시글 삭제)
  const deletepostRoutes = require("./routes/post/deletePost")(db);
  app.use("/posts",deletepostRoutes);  

  // detailPost 라우트 연결 (게시글 상세 정보 조회)
  const detailPostRoutes = require("./routes/post/detailPost")(db);
  app.use("/posts", detailPostRoutes);
  
  // likePost 라우트 연결 (게시글 공감하기)
  const likePostRoutes = require("./routes/post/likePost")(db);
  app.use("/posts", likePostRoutes);

  // scrapPost 라우트 연결 (게시글 스크랩하기)
  const scrapPostRoutes = require("./routes/post/scrapPost")(db);
  app.use("/posts", scrapPostRoutes);

  // createComment 라우트 연결
  const createCommentRoutes = require("./routes/comment/createComment")(db);
  app.use("/posts", createCommentRoutes);

  // readComment 라우트 연결
  const readCommentRoutes = require("./routes/comment/readComment")(db);
  app.use("/posts", readCommentRoutes);

  // updateComment 라우트 연결
  const updateCommentRoutes = require("./routes/comment/updateComment")(db);
  app.use("/comments", updateCommentRoutes);

  // deleteComment 라우트 연결
  const deleteCommentRoutes = require("./routes/comment/deleteComment")(db);
  app.use("/comments", deleteCommentRoutes);

  // uploadImage 라우트 연결
  const uploadImageRoutes = require("./routes/image/uploadImage")(db);
  app.use("/image", uploadImageRoutes);

  // 서버 시작
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
})();