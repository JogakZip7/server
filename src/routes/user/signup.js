const express = require("express");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");

module.exports = (db) => {
  const router = express.Router();

  // 회원가입 라우트
  router.post("/signup", async (req, res) => {
    const { nickname, password } = req.body;
    const id = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const [rows] = await db.execute("SELECT * FROM USER WHERE nickname = ?", [nickname]);
      if (rows.length > 0) return res.status(400).send("Nickname already taken");

      await db.execute("INSERT INTO USER (id, nickname, password) VALUES (?, ?, ?)", [
        id,
        nickname,
        hashedPassword,
      ]);

      res.status(201).send("회원가입이 완료되었습니다");
    } catch (err) {
      console.error(err);
      res.status(400).send("잘못된 요청입니다");
    }
  });

  return router;
};

