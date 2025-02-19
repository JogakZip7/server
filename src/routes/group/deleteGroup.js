const express = require("express");
const auth = require("../../../middleware/auth");

module.exports = (db) => {
  const router = express.Router();

  router.delete("/:groupId", auth, async (req, res) => {
    try {
      const userId = req.user.id;
      const { groupId } = req.params;

      if (!groupId) throw { status: 400, message: "잘못된 요청입니다" };

      const [groupRows] = await db.query(
        "SELECT owner FROM `GROUP` WHERE id = ?",
        [groupId]
      );

      if (groupRows[0].owner !== userId) {
        throw { status: 403, message: "그룹 삭제 권한이 없습니다" };
      }

      await db.execute("DELETE FROM PARTICIPATE WHERE groupId = ?", [groupId]);
      await db.execute("DELETE FROM POST WHERE groupId = ?", [groupId]);
      await db.execute("DELETE FROM `GROUP` WHERE id = ?", [groupId]);

      res.status(200).json({ message: "그룹 삭제 완료" });
    } catch (err) {
      res.status(err.status || 500).json({ message: err.message || "서버 오류가 발생했습니다" });
    }
  });

  return router;
};
