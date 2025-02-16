const express = require("express");
const auth = require("../../../middleware/auth");

module.exports = (db) => {
  const router = express.Router();

  // 게시글 등록 라우트 (POST 테이블 생성)
  router.post("/:groupId/posts", auth, async (req, res) => {
    const { groupId } = req.params;

    const { title, content, imageUrl, isPublic, location, moment } = req.body;


    try {
      const userId = req.user.id;
      const nickname = req.user.nickname;

      console.log(groupId, userId, nickname, groupId, title, content, imageUrl, isPublic, location, moment);

      //게시글 POST 테이블 등록 (id는 자동 등록)
      const [result] = await db.execute(`
        INSERT INTO POST (userId, groupId, title, content, imageUrl, isPublic, location, moment, likeCount, commentCount, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, 0, NOW())`,
        [userId, groupId, title, content, imageUrl, isPublic, location, moment]
      );
      
      const post = {
        id: result.insertId,
        groupId,
        nickname,
        title,
        content,
        imageUrl,
        location,
        moment,
        isPublic,
        likeCount: 0,
        commentCount: 0,
        createdAt: new Date().toISOString(),
      };
 
      res.status(200).json(post);
    } catch (err) {
      res.status(400).json({ message: err.message || "잘못된 요청입니다" });
    }
  });

  return router;
};
