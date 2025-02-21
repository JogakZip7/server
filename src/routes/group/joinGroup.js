const express = require("express");
const auth = require("../../../middleware/auth");

module.exports = (db) => {
  const router = express.Router();

  router.post("/:groupId/join", auth, async (req, res) => {
    try {
      const userId = req.user.id;
      const { groupId } = req.params;

      const [groupRows] = await db.query("SELECT id FROM `GROUP` WHERE id = ?", [groupId]);
      if (!groupRows.length) throw { status: 404, message: "존재하지 않는 그룹입니다" };

      const [existing] = await db.query("SELECT * FROM PARTICIPATE WHERE userId = ? AND groupId = ?", [userId, groupId]);
      if (existing.length) throw { status: 400, message: "이미 가입된 그룹입니다" };

      await db.execute("INSERT INTO PARTICIPATE (userId, groupId) VALUES (?, ?)", [userId, groupId]);
      await db.execute(`
        UPDATE \`GROUP\` g 
        SET g.memberCount = (SELECT COUNT(*) FROM PARTICIPATE p WHERE p.groupId = g.id)
        WHERE g.id = ?;
      `, [groupId]);

      res.status(200).json({ message: "그룹 가입 성공" });
    } catch (err) {
      res.status(err.status || 500).json({ message: err.message || "서버 오류가 발생했습니다" });
    }
  });

  return router;
};
