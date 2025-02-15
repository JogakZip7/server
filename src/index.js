const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const mysql = require("mysql2/promise");
require("dotenv").config();  // .env 파일에서 환경 변수 로드


const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json()); // JSON 요청파싱

// MySQL 연결 설정
async function connectDB() {
  try {
    const db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "1234",
      database: "team7_db",
      port: 3306
    });
    console.log("Connected to the database!");
    return db; // 연결된 db 객체 반환
  } catch (err) {
    console.error("Database connection failed:", err);
    process.exit(1); // 연결 실패 시 프로세스 종료
  }
}

//db사용
(async () => {
  const db = await connectDB(); // DB 연결 완료

  // createpost 라우트 연결 (게시글 등록)
  const createpostRoutes = require("./routes/post/createpost")(db);
  app.use("/api/groups/:groupId/posts", createpostRoutes);

  // postslist 라우트 연결 (게시글 목록 조회)

  // updatepost 라우트 연결 (게시글 수정)

  // deletepost 라우트 연결 (게시글 삭제)

  // postdetail 라우트 연결 (게시글 상세 정보 조회)

  // postpermission 라우트 연결 (게시글 조회 권한 확인)

  // likepost 라우트 연결 (게시글 공감하기)






  // signup 라우트 연결
  const signupRoutes = require("./routes/user/signup")(db);
  app.use("/api", signupRoutes);

  //signin 라우트 연결
  const signinRoutes=require ("./routes/user/signin")(db);
  app.use("/api",signinRoutes);

  //signout 라우트 연결
  const signoutRoutes= require ("./routes/user/signout")(db);
  app.use("/api",signoutRoutes);

  //deleteuser 라우트 연결
  const deleteuserRoutes = require("./routes/user/deleteuser")(db);
  app.use("/api", deleteuserRoutes);

  //mygroups
  const showGroupsRoutes = require("./routes/user/mygroups")(db);
  app.use("/api", showGroupsRoutes);

  const myScrapsRoutes = require("./routes/user/myscraps")(db);
  app.use("/api", myScrapsRoutes);

  // createGroup 라우트 연결
  const createGroup = require("./routes/group/createGroup")(db);
  app.use("/api/groups", createGroup);

  // modifyGroup 라우트 연결
  const modifyGroup = require("./routes/group/modifyGroup")(db);
  app.use("/api/groups", modifyGroup);

  // deleteGroup 라우트 연결
  const deleteGroup = require("./routes/group/deleteGroup")(db);
  app.use("/api/groups", deleteGroup);

  // detailGroup 라우트 연결
  const detailGroup = require("./routes/group/detailGroup")(db);
  app.use("/api/groups", detailGroup);

  // 서버 시작
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
})();