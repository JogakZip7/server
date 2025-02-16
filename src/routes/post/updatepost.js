const express = require("express");
const auth = require("../../../middleware/auth");

module.exports = (db) => {
  const router = express.Router();

  router.put("/:postId", auth, async (req, res) => {
    const {
      title,
      content,
      postPassword,
      imageUrl,
      location,
      moment,
      isPublic,
    } = req.body;

    const { postId } = req.params;

    try {
      const userId = req.user.id;
      const nickname = req.user.nickname;

      //게시글 작성자인지 확인
      const [checkRow] = await db.execute(`
        SELECT userId FROM POST
        WHERE id = ?`, [postId]
      );
      if (checkRow[0].userId !== userId) {
        throw new Error('권한이 없습니다.');
      }
      
      
      //POST 테이블 업데이트
      const [result] = await db.execute(`
         UPDATE POST
         SET
            title = ?,
            content = ?,
            imageUrl = ?,
            location = ?,
            moment = ?,
            isPublic = ?
         WHERE id = ?`,
         [title, content, imageUrl, location, moment, isPublic, postId]
       );
       if(result.affectedRows === 0){
         return res.status(404).json({message: "존재하지 않습니다"});
       }

       const [responseRow] = await db.execute(`
         SELECT id, groupId, title, content, imageUrl, location, moment, isPublic, likeCount, commentCount, createdAt
         FROM POST
         WHERE id = ?`,
         [postId]
      );


      const response = {
         id: responseRow[0].id,
         groupId: responseRow[0].groupId,
         nickname: nickname,
         title: responseRow[0].title,
         content: responseRow[0].content,
         imageUrl: responseRow[0].imageUrl,
         location: responseRow[0].location,
         moment: responseRow[0].moment,
         isPublic: responseRow[0].isPublic,
         likeCount: responseRow[0].likeCount,
         commentCount: responseRow[0].commentCount,
         createdAt: responseRow[0].createdAt
      }
      
      res.status(200).json(response);

    } catch (err) {
      res.status(400).json({ message: err || "잘못된 요청입니다" });
    }
  });
  return router;
};
