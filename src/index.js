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

  // signup 라우트 연결
  const signupRoutes = require("./routes/signup")(db);
  app.use("/api/signup", signupRoutes);

  //signin 라우트 연결
  const signinRoutes=require ("./routes/signin")(db);
  app.use("/api/signin",signinRoutes);

  //signout 라우트 연결
  const signoutRoutes= require ("./routes/signout")(db);
  app.use("/api/signout",signoutRoutes);

  //deleteuser 라우트 연결
  const deleteuserRoutes = require("./routes/deleteuser")(db);
  app.use("/api/deleteuser", deleteuserRoutes);

  // 서버 시작
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
})();


