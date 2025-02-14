const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports = (db) => {
  const router = express.Router();

  // 로그인 라우트
  router.post("/", async (req, res) => {
    const { nickname, password } = req.body;

    try {
      // 닉네임으로 사용자 조회
      const [rows] = await db.execute("SELECT * FROM USER WHERE nickname = ?", [nickname]);
      if (rows.length === 0) {
        return res.status(401).send("Invalid nickname or password");
      }

      const user = rows[0];
      // 비밀번호 검증
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).send("Invalid nickname or password");
      }

      // JWT 토큰 생성
      const token = jwt.sign({ id: user.id, nickname: user.nickname }, process.env.JWT_SECRET, {
        expiresIn: "5h",  //토큰 만료 시간
      });

      res.status(200).json({ message: "Login successful", token });
    } catch (err) {
      console.error(err);
      res.status(500).send("Error logging in");
    }
  });

  return router;
};
