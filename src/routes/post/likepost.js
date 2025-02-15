const express = require("express");

module.exports = (db) => {
  const router = express.Router();
  router.post("/posts/:postId/like", async (req, res) => {
    const { postId, Id } = req.params;

    try {
      
      const [result] = await db.execute(`
        SELECT * FROM LIKE
        WHERE postId = ? AND userId = ?`, [postId, Id]);
      
      if(result.length == 0 ){
        res.status(200).json({ message: '게시글 공감하기 성공'})
      } else if(result.length > 0){
        res.status(200).json({ message: '이미 공감한 게시글입니다'})
      } else{
        res.status(404).json({ message: "존재하지 않습니다" });  
      }
    } catch (err) {
      res.status(404).json({ message: "존재하지 않습니다" });
    }
  });
  return router;
};
