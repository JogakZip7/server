const express = require("express");
const auth = require("../../../middleware/auth");

module.exports = (db) => {
  const router = express.Router();

  // 그룹 생성 라우트
  router.post("/", auth, async (req, res) => {
    try {
      const userId = req.user.id;
      const { name, imageUrl, introduction } = req.body;
      if (!name || !imageUrl || !introduction) throw { status: 400, message: "잘못된 요청입니다" };

      const [result] = await db.execute(
        "INSERT INTO `GROUP` (name, imageUrl, introduction, postCount, memberCount) VALUES (?, ?, ?, 0, 1)",
        [name, imageUrl, introduction]
      );

      await db.execute("INSERT INTO PARTICIPATE (userId, groupId) VALUES (?, ?)", [userId, result.insertId]);
      res.status(201).json({ id: result.insertId, name, imageUrl, introduction, postCount: 0, badges: [] });
    } catch (err) {
      res.status(err.status || 500).json({ message: err.message || "서버 오류가 발생했습니다" });
    }
  });

  return router;
};
