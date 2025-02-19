const express = require("express");

module.exports = (db) => {
  const router = express.Router();

  router.get("/", async (req, res) => {
    try {
      let { limit = 8 } = req.query;
      limit = parseInt(limit);

      if (isNaN(limit) || limit < 1) {
        throw { status: 400, message: "잘못된 요청입니다" };
      }

      // 랜덤하게 그룹 가져오기
      const [groupRows] = await db.execute(
        `SELECT id, name, imageUrl, introduction 
         FROM \`GROUP\` 
         ORDER BY RAND() 
         LIMIT ?`,
        [limit]
      );

      res.status(200).json({
        data: groupRows,
      });
    } catch (err) {
      res.status(err.status || 500).json({ message: err.message || "서버 오류가 발생했습니다" });
    }
  });

  return router;
};
