const express = require("express");

module.exports = (db) => {
  const router = express.Router();
  router.get("/posts/:postId", async (req, res) => {
    const { postId } = req.params;

    try {
      //postId를 통해 userId 받아오기
      const [userIdRow] = await db.execute(`
            SELECT userId
            FROM POST
            WHERE id = ?`,
        [postId]
      );
      const userId = userIdRow[0]?.userId;

      //userId를 통해 nickname 받아오기
      const [nicknameRow] = await db.execute(`
            SELECT nickname
            FROM USERS
            WHERE id = ?`,
        [userId]
      );
      const nickname = nicknameRow[0]?.nickname;

      //요청받은 postId에 맞는 튜플 가져오기
      const [postRow] = await db.execute(`
        SELECT * FROM POST
        WHERE id = ?`, [postId]
      );
      const result = postRow[0];

      //response 객체
      const post = {
        id: result.id,
        groupId: result.groupId,
        nickname,
        title: result.title,
        content: result.content,
        imageUrl: result.imageUrl,
        location: result.location,
        moment: result.moment,
        isPublic: result.isPublic,
        likeCount: result.likeCount,
        commentCount: result.commentCount,
        createdAt: result.createdAt,
      };
      res.status(200).json(post);
    } catch (err) {
      res.status(400).json({ message: "잘못된 요청입니다" });
    }
  });
  return router;
};
