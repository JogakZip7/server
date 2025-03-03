const express = require("express");
const auth = require("../../../middleware/auth");

module.exports = (db) => {
  const router = express.Router();

  router.get("/:postId/details", auth, async (req, res) => {
    const { postId } = req.params;
    
    try {

      const userId = req.user.id;

      //게시글 그룹아이디, 공개여부 가져오기
      const [groupRow] = await db.query(`
        SELECT groupId, isPublic
        FROM POST
        WHERE id = ?`, [postId]
      );
      const groupId = groupRow[0].groupId;
      const isPublic = groupRow[0].isPublic;

      //비공개 게시물인 경우 상세정보 조회 권한 확인 (<- group 차원에서 막힐 것 같지만 일단 구현해놓았습니다.)
      const [authRow] = await db.query(`
        SELECT * FROM PARTICIPATE
        WHERE userId = ? AND groupId = ?
        `, [userId, groupId]
      )
      if( isPublic === false && (!authRow || authRow.length === 0) ){
        return res.status(403).json({ message: "조회 권한이 없습니다" });
      }


      //요청받은 postId에 맞는 튜플 가져오기
      const [postRow] = await db.query(`
        SELECT P.*, U.nickname
        FROM POST P
        JOIN USER U ON P.userId = U.id
        WHERE P.id = ?`, [postId]
      );
      const result = postRow[0];

      //response 객체
      const response = {
        id: result.id,
        groupId: result.groupId,
        nickname: result.nickname,
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
      res.status(200).json(response);
    } catch (err) {
      res.status(400).json({ message: "잘못된 요청입니다" });
    }
  
  });

  return router;
};
