const express = require("express");
const auth = require("../../../middleware/auth");

module.exports = (db) => {
  const router = express.Router();

  // 게시글 등록 라우트 (POST 테이블 생성)
  router.post("/:groupId/posts", auth, async (req, res) => {
    const { groupId } = req.params;

    const { title, content, imageUrl, isPublic, location, moment } = req.body;


    try {
      const userId = req.user.id;           //로그인한 유저 아이디
      const nickname = req.user.nickname;   //로그인한 유저 닉네임

      //그룹 내 사람만 등록 가능
      const [authRow] = await db.execute(`
        SELECT * FROM PARTICIPATE
        WHERE userId = ? AND groupId = ?
        `, [userId, groupId]
      )
      if(isPublic === false && (!authRow || authRow.length === 0)){
        return res.status(400).json({ message: "등록 권한이 없습니다" });
      }


      //게시글 POST 테이블 등록 (id는 자동 등록)
      const [result] = await db.execute(`
        INSERT INTO POST (userId, groupId, title, content, imageUrl, isPublic, location, moment, likeCount, commentCount, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, 0, NOW())`,
        [userId, groupId, title, content, imageUrl, isPublic, location, moment]
      );
      
      //response 객체.
      const response = {
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
 
      res.status(200).json(response);
    } catch (err) {
      res.status(400).json({ message: "잘못된 요청입니다" });
    }
  });

  return router;
};
