const express = require("express");

module.exports = () => {
  const router = express.Router();

  // 로그아웃 라우트
  router.post("/signout", (req, res) => {
    // 클라이언트 측에서 JWT 토큰을 삭제하도록 유도하는 응답
    res.status(200).json({ message: "Logout successful" });
  });

  return router;
};
