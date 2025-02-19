const express = require("express");
const auth = require("../../../middleware/auth");

module.exports = (db) => {
  const router = express.Router();

  router.delete("/:groupId/leave", auth, async (req, res) => {
    try {
      const userId = req.user.id;
      const { groupId } = req.params;

      if (!groupId) throw { status: 400, message: "잘못된 요청입니다" };

      const [groupRows] = await db.query("SELECT owner, memberCount FROM `GROUP` WHERE id = ?", [groupId]);
      if (!groupRows.length) throw { status: 404, message: "존재하지 않는 그룹입니다" };

      const { owner, memberCount } = groupRows[0];

      // 그룹 소유자는 탈퇴 불가능
      if (owner === userId) {
        throw { status: 403, message: "그룹장은 탈퇴할 수 없습니다" };
      }

      // 탈퇴 처리
      await db.execute("DELETE FROM PARTICIPATE WHERE userId = ? AND groupId = ?", [userId, groupId]);
      if (memberCount > 0) {
        await db.execute("UPDATE `GROUP` SET memberCount = memberCount - 1 WHERE id = ?", [groupId]);
      }

      res.status(200).json({ message: "그룹 탈퇴 성공" });
    } catch (err) {
      res.status(err.status || 500).json({ message: err.message || "서버 오류가 발생했습니다" });
    }
  });

  return router;
};
