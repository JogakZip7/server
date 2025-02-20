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
  origin: ["http://jogakzip7.s3-website-us-east-1.amazonaws.com", "http://localhost:3000"], // S3 URL 허용
  methods: ["GET", "POST", "PUT", "DELETE"],
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

  // 메인 화면
  const grouplistRoutes = require("./routes/group/grouplist")(db);
  app.use("/api/groups", grouplistRoutes);

  // signup 라우트 연결
  const signupRoutes = require("./routes/user/signup")(db);
  app.use("/api", signupRoutes);

  // signin 라우트 연결
  const signinRoutes=require ("./routes/user/signin")(db);
  app.use("/api",signinRoutes);

  // signout 라우트 연결
  const signoutRoutes= require ("./routes/user/signout")(db);
  app.use("/api",signoutRoutes);

  // deleteuser 라우트 연결
  const deleteuserRoutes = require("./routes/user/deleteuser")(db);
  app.use("/api", deleteuserRoutes);

  // mygroups 라우트 연결
  const mygroupsRoutes = require("./routes/user/mygroups")(db);
  app.use("/api", mygroupsRoutes);

  // myscraps 라우트 연결
  const myscrapsRoutes = require("./routes/user/myscraps")(db);
  app.use("/api", myscrapsRoutes);

  // createGroup 라우트 연결
  const createGroupRoutes = require("./routes/group/createGroup")(db);
  app.use("/api/groups", createGroupRoutes);

  // modifyGroup 라우트 연결
  const modifyGroupRoutes = require("./routes/group/modifyGroup")(db);
  app.use("/api/groups", modifyGroupRoutes);

  // deleteGroup 라우트 연결
  const deleteGroupRoutes = require("./routes/group/deleteGroup")(db);
  app.use("/api/groups", deleteGroupRoutes);

  // detailGroup 라우트 연결
  const detailGroupRoutes = require("./routes/group/detailGroup")(db);
  app.use("/api/groups", detailGroupRoutes);

  // joinGroup 라우트 연결
  const joinGroupRoutes = require("./routes/group/joinGroup")(db);
  app.use("/api/groups", joinGroupRoutes);

  // leaveGroup 라우트 연결
  const leaveGroupRoutes = require("./routes/group/leaveGroup")(db);
  app.use("/api/groups", leaveGroupRoutes);

  // createpost 라우트 연결 (게시글 등록)
  const createpostRoutes = require("./routes/post/createpost")(db);
  app.use("/api/groups", createpostRoutes);

  // postslist 라우트 연결 (게시글 목록 조회)
  const postslistRoutes = require("./routes/post/postslist")(db);
  app.use("/api/groups", postslistRoutes);

  // updatepost 라우트 연결 (게시글 수정)
  const updatepostRoutes = require("./routes/post/updatepost")(db);
  app.use("/api/posts",updatepostRoutes);

  // deletepost 라우트 연결 (게시글 삭제)
  const deletepostRoutes = require("./routes/post/deletepost")(db);
  app.use("/api/posts",deletepostRoutes);  

  // postdetail 라우트 연결 (게시글 상세 정보 조회)
  const postdetailRoutes = require("./routes/post/postdetail")(db);
  app.use("/api/posts", postdetailRoutes);
  
  // likepost 라우트 연결 (게시글 공감하기)
  const likepostRoutes = require("./routes/post/likepost")(db);
  app.use("/api/posts", likepostRoutes);

  // scrapPost 라우트 연결 (게시글 스크랩하기)
  const scrapPostRoutes = require("./routes/post/scrapPost")(db);
  app.use("/api/posts", scrapPostRoutes);

  // createComment 라우트 연결
  const createCommentRoutes = require("./routes/comment/createComment")(db);
  app.use("/api/posts", createCommentRoutes);

  // readComment 라우트 연결
  const readCommentRoutes = require("./routes/comment/readComment")(db);
  app.use("/api/posts", readCommentRoutes);

  // updateCommnet 라우트 연결
  const updateCommnetRoutes = require("./routes/comment/updateCommnet")(db);
  app.use("/api/comments", updateCommnetRoutes);

  // deleteComment 라우트 연결
  const deleteCommentRoutes = require("./routes/comment/deleteComment")(db);
  app.use("/api/comments", deleteCommentRoutes);

  // uploadImage 라우트 연결
  const uploadImageRoutes = require("./routes/image/uploadImage")(db);
  app.use("/api/image", uploadImageRoutes);

  // 서버 시작
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
})();