const express = require("express");
const auth = require("../../../middleware/auth");

module.exports = (db) => {
  const router = express.Router();
  router.delete("/:postId", auth, async (req, res) => {
    const { postId } = req.params;

    try {
      const userId = req.user.id;
      
      //게시글 삭제 권한 확인
      const [checkRow] = await db.execute(`
        SELECT userId FROM POST
        WHERE id = ?`, [postId]
      );
      if (checkRow[0].userId !== userId) {
        throw new Error('권한이 없습니다.');
      }


      //게시글 삭제 시도
      const [result] = await db.execute(`
        DELETE FROM POST
        WHERE id = ?`, [postId]
      );
      
      //게시글 삭제 성공
      if( result.affectedRows > 0 ) return res.status(200).json({ message: "게시글 삭제 성공"});
      //게시글이 없을 때
      else return res.status(404).json({ message: "존재하지 않습니다"});

      // Api 수정 필요
      // if(  ) return res.status(403).json({ message: "비밀번호가 틀렸습니다"});
      
    } catch (err) {
      // 기타 에러
      res.status(400).json({ message: "잘못된 요청입니다" });
    }
  });
  return router;
};
