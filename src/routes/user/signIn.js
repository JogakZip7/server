const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports = (db) => {
  const router = express.Router();

  // 로그인 라우트
  router.post("/signin", async (req, res) => {
    console.log("Login request received");
    const { nickname, password } = req.body;

    try {
      // 닉네임으로 사용자 조회
      const [rows] = await db.query("SELECT * FROM USER WHERE nickname = ?", [nickname]);
      if (rows.length === 0) {
        return res.status(401).send({message: "유효하지 않은 닉네임입니다"});
      }

      const user = rows[0];
      // 비밀번호 검증
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).send({message: "유효하지 않은 비밀번호입니다"});
      }

      // JWT 토큰 생성
      const token = jwt.sign({ id: user.id, nickname: user.nickname }, process.env.JWT_SECRET, {
        expiresIn: "5h",  //토큰 만료 시간
      });

      res.status(200).json({ message: "로그인이 완료되었습니다", nickname: user.nickname, token });
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: "로그인에 에러가 발생하였습니다"});
    }
  });

  return router;
};
