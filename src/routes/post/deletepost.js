const express = require("express");

module.exports = (db) => {
  const router = express.Router();
  router.delete("/posts/:postId", async (req, res) => {
    const { postId } = req.params;

    try {
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
