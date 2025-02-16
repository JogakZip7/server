const express = require("express");
const auth = require("../../middlewares/auth");  // JWT 인증 미들웨어

module.exports = (db) => {
  const router = express.Router();

  router.get("/myscraps", auth, async (req, res) => {
    const { page = 1, pageSize = 10, sortBy = "latest", keyword = "", isPublic, groupId } = req.query;
    const offset = (page - 1) * pageSize;
    let orderByClause = "P.createdAt DESC"; // 기본 정렬은 최신순

    // 정렬 조건 설정
    switch (sortBy) {
      case "mostCommented":
        orderByClause = "P.commentCount DESC";
        break;
      case "mostLiked":
        orderByClause = "P.likeCount DESC";
        break;
    }

    try {
      // 사용자 스크랩한 게시물 조회 쿼리
      const [posts] = await db.execute(
        `
        SELECT P.id, U.nickname, P.title, P.imageUrl, P.location, P.moment, P.isPublic,
               P.likeCount, P.commentCount, P.createdAt
        FROM SCRAP S
        JOIN POST P ON S.postId = P.id
        JOIN USER U ON P.userId = U.id
        WHERE S.userId = ?
          AND (P.title LIKE ? OR P.content LIKE ?)
          ${groupId ? "AND P.groupId = ?" : ""}
          ${isPublic !== undefined ? "AND P.isPublic = ?" : ""}
        ORDER BY ${orderByClause}
        LIMIT ? OFFSET ?
        `,
        [
          req.user.id,
          `%${keyword}%`,
          `%${keyword}%`,
          ...(groupId ? [groupId] : []),
          ...(isPublic !== undefined ? [isPublic] : []),
          parseInt(pageSize),
          parseInt(offset),
        ]
      );

      // 전체 게시물 수 조회
      const [countResult] = await db.execute(
        `
        SELECT COUNT(*) AS totalItemCount
        FROM SCRAP S
        JOIN POST P ON S.postId = P.id
        WHERE S.userId = ?
          AND (P.title LIKE ? OR P.content LIKE ?)
          ${groupId ? "AND P.groupId = ?" : ""}
          ${isPublic !== undefined ? "AND P.isPublic = ?" : ""}
        `,
        [
          req.user.id,
          `%${keyword}%`,
          `%${keyword}%`,
          ...(groupId ? [groupId] : []),
          ...(isPublic !== undefined ? [isPublic] : []),
        ]
      );

      const totalItemCount = countResult[0].totalItemCount;
      const totalPages = Math.ceil(totalItemCount / pageSize);

      res.status(200).json({
        currentPage: parseInt(page),
        totalPages,
        totalItemCount,
        data: posts,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error retrieving scraped posts" });
    }
  });

  return router;
};
