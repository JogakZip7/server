const express = require("express");
const auth = require("../middlewares/auth");  // auth 미들웨어 사용

module.exports = (db) => {
  const router = express.Router();

  router.get("/", auth, async (req, res) => {  // auth 미들웨어 추가
    const { page = 1, pageSize = 10, sortBy = "latest", keyword = "" } = req.query;
    const offset = (page - 1) * pageSize;

    try {
      const [groups] = await db.execute(
        `SELECT G.id, G.name, G.imageUrl, G.introduction, G.postCount, G.createdAt
         FROM PARTICIPATE P
         JOIN \`GROUP\` G ON P.groupId = G.id
         WHERE P.userId = ? AND G.name LIKE ?
         ORDER BY G.createdAt DESC
         LIMIT ? OFFSET ?`,
        [req.user.id, `%${keyword}%`, parseInt(pageSize), parseInt(offset)]
      );

      const [countResult] = await db.execute(
        `SELECT COUNT(*) AS totalItemCount
         FROM PARTICIPATE P
         JOIN \`GROUP\` G ON P.groupId = G.id
         WHERE P.userId = ? AND G.name LIKE ?`,
        [req.user.id, `%${keyword}%`]
      );

      res.status(200).json({
        currentPage: parseInt(page),
        totalPages: Math.ceil(countResult[0].totalItemCount / pageSize),
        totalItemCount: countResult[0].totalItemCount,
        data: groups,
      });
    } catch (err) {
      console.error(err);
      res.status(500).send("Error retrieving groups");
    }
  });

  return router;
};
