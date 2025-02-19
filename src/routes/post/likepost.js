const express = require("express");
const auth = require("../../../middleware/auth");

module.exports = (db) => {
  const router = express.Router();
  router.post("/:postId/like", auth, async (req, res) => {
    const { postId } = req.params;

    try {
      const userId = req.user.id; //로그인한 유저 아이디

      const [result] = await db.query(`
        SELECT * FROM \`LIKE\`
        WHERE postId = ? AND userId = ?`, [postId, userId]);


      if(result.length === 0 ){
        //공감한 기록이 없으면 POST 테이블 likeCount 1 증가
        await db.execute(`
          UPDATE POST
          SET likeCount = likeCount + 1
          WHERE id = ?`, [postId]);

        // LIKE 테이블에 새로운 공감 기록 추가
        await db.execute(`
          INSERT INTO \`LIKE\` (postId, userId)
          VALUES (?, ?)`, [postId, userId]);
        
        res.status(200).json({ message: '게시글 공감하기 성공'})
      } else if(result.length > 0){
        res.status(409).json({ message: '이미 공감한 게시글입니다'})
      } else{
        throw new Error();
      }
    } catch (err) {
      res.status(404).json({ message: "존재하지 않습니다" });
    }
  });
  return router;
};
