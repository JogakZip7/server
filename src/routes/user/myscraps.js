const express = require("express");
const auth = require("../../../middleware/auth");

module.exports = (db) => {
  const router = express.Router();

  router.get("/myscraps", auth, async (req, res) => {
    const { page = 1, pageSize = 10, sortBy = "latest", keyword = "" } = req.query;
    const offset = (page - 1) * pageSize;
    let orderByClause = "P.createdAt DESC";

    if (sortBy === "mostCommented") orderByClause = "P.commentCount DESC";
    if (sortBy === "mostLiked") orderByClause = "P.likeCount DESC";

    try {
      const pageSizeParam = Number.isInteger(parseInt(pageSize)) ? parseInt(pageSize) : 10;
      const offsetParam = Number.isInteger(parseInt(offset)) ? parseInt(offset) : 0;

      const [posts] = await db.execute(
        `
        SELECT P.id, U.nickname, P.title, P.imageUrl, P.location, P.moment, P.isPublic,
               P.likeCount, P.commentCount, P.createdAt
        FROM SCRAP S
        JOIN POST P ON S.postId = P.id
        JOIN USER U ON P.userId = U.id
        WHERE S.userId = ?
          AND (P.title LIKE ? OR P.content LIKE ?)
        ORDER BY ${orderByClause}
        LIMIT ? OFFSET ?
        `,
        [req.user.id, `%${keyword}%`, `%${keyword}%`, pageSizeParam, offsetParam]
      );

      if (posts.length === 0) {
        return res.status(200).json({
          message: "You have no scraped posts.",
          currentPage: parseInt(page),
          totalPages: 0,
          totalItemCount: 0,
          data: [],
        });
      }

      const [countResult] = await db.execute(
        `
        SELECT COUNT(*) AS totalItemCount
        FROM SCRAP S
        JOIN POST P ON S.postId = P.id
        WHERE S.userId = ?
          AND (P.title LIKE ? OR P.content LIKE ?)
        `,
        [req.user.id, `%${keyword}%`, `%${keyword}%`]
      );

      const totalItemCount = countResult[0].totalItemCount;
      const totalPages = Math.ceil(totalItemCount / pageSize);

      res.status(200).json({
        currentPage: parseInt(page),
        totalPages,
        totalItemCount,
        data: posts.map(post => ({
          id: post.id,
          nickname: post.nickname,
          title: post.title,
          imageUrl: post.imageUrl,
          location: post.location,
          moment: post.moment,
          isPublic: post.isPublic,
          likeCount: post.likeCount,
          commentCount: post.commentCount,
          createdAt: post.createdAt,
        })),
      });
    } catch (err) {
      console.error("SQL Error:", err);
      res.status(500).json({ message: "Error retrieving scraped posts" });
    }
  });

  return router;
};
