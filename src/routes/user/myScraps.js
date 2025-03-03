const express = require("express");
const auth = require("../../../middleware/auth");

module.exports = (db) => {
  const router = express.Router();

  router.get("/myscraps", auth, async (req, res) => {
    const { page = 1, pageSize = 8, sortBy = "latest" } = req.query;
    const offset = Number(page - 1) * Number(pageSize);  // 숫자 변환 보장
    let orderByClause = "P.createdAt DESC"; // 기본 정렬: 최신순

    if (sortBy === "mostCommented") orderByClause = "P.commentCount DESC";
    if (sortBy === "mostLiked") orderByClause = "P.likeCount DESC";

    console.log("Page:", page, "PageSize:", pageSize, "Offset:", offset); // 확인 로그

    try {
      const [posts] = await db.query(
        `
        SELECT P.id, U.nickname, P.title, P.imageUrl, P.location, P.moment, P.isPublic, 
               P.likeCount, P.commentCount, P.content
        FROM SCRAP S
        JOIN POST P ON S.postId = P.id
        JOIN USER U ON P.userId = U.id
        WHERE S.userId = ?
        ORDER BY ${orderByClause}
        `,
        [req.user.id, parseInt(pageSize), parseInt(offset)]
      );

      res.status(200).json({
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
          content: post.content
        })),
      });
    } catch (err) {
      console.error("SQL Error:", err);
      res.status(400).json({ message: "잘못된 요청입니다" });
    }
  });

  return router;
};