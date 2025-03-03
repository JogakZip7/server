const express = require("express");
const jwt = require("jsonwebtoken");

module.exports = (db) => {
  const router = express.Router();

  // 회원탈퇴 라우트
  router.delete("/deleteuser", async (req, res) => {
    const token = req.headers["authorization"]; // Authorization 헤더에서 JWT 토큰 가져오기

    if (!token) {
      return res.status(401).send("토큰이 없습니다");
    }

    try {
      // JWT 토큰 검증
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const { nickname } = decoded; // 토큰에서 nickname 가져오기

      // 사용자가 요청한 nickname과 토큰의 nickname이 일치하는지 확인
      if (!nickname) {
        return res.status(400).send({message: "유효하지 않은 토큰입니다"});
      }

      // 닉네임으로 사용자 조회
      const [rows] = await db.execute("SELECT * FROM USER WHERE nickname = ?", [nickname]);
      if (rows.length === 0) {
        return res.status(404).send({message: "유저를 찾을 수 없습니다"});
      }

      // 사용자 삭제
      await db.execute("DELETE FROM USER WHERE nickname = ?", [nickname]);

      res.status(200).json({ message: "회원탈퇴 되었습니다" });
    } catch (err) {
      console.error(err);
      res.status(500).send({message: "회원탈퇴에 오류가 발생하였습니다"});
    }
  });

  return router;
};

