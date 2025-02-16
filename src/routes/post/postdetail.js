const express = require("express");
const auth = require("../../../middleware/auth");

module.exports = (db) => {
  const router = express.Router();

  router.get("/:postId", auth, async (req, res) => {
    const { postId } = req.params;
    
    try {

      const userId = req.user.id;
      const nickname = req.user.nickname;

      //게시글 그룹아이디 가져오기
      const [groupRow] = await db.execute(`
        SELECT groupId FROM POST
        WHERE id = ?`, [postId]
      );
      const groupId = groupRow[0].groupId;

      //상세정보 조회 권한 확인
      const [authRow] = await db.execute(`
        SELECT * FROM PARTICIPATE
        WHERE userId = ? AND groupId = ?
        `, [userId, groupId]
      )
      if(!authRow || authRow.length !== 1){
        return res.status(400).json({ message: err || "권한이 없습니다" });
      }


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
      res.status(400).json({ message: err || "잘못된 요청입니다" });
    }
  
  });

  return router;
};
