const express = require("express");
const auth = require("../../../middleware/auth");

module.exports = (db) => {
  const router = express.Router();

  router.get("/mygroups", auth, async (req, res) => {
    try {
      const userId = req.user.id;

      // 내가 참여한 그룹 조회
      const [groups] = await db.query(
        `
        SELECT G.id, G.name, G.imageUrl, G.introduction, G.postCount, 
               (SELECT COUNT(*) FROM PARTICIPATE P WHERE P.groupId = G.id) AS badgeCount
        FROM PARTICIPATE PA
        JOIN \`GROUP\` G ON PA.groupId = G.id
        WHERE PA.userId = ?
        `,
        [userId]
      );

      if (groups.length === 0) {
        return res.status(200).json({
          message: "그룹이 없습니다.",
          currentPage: 1,
          totalPages: 0,
          totalItemCount: 0,
          data: [],
        });
      }

      res.status(200).json({
        currentPage: 1,
        totalPages: 1,
        totalItemCount: groups.length,
        data: groups.map(group => ({
          id: group.id,
          name: group.name,
          imageUrl: group.imageUrl,
          badgeCount: group.badgeCount,
          postCount: group.postCount,
          introduction: group.introduction,
        })),
      });
    } catch (err) {
      console.error("SQL Error:", err);
      res.status(400).json({ message: "잘못된 요청입니다" });
    }
  });

  return router;
};
