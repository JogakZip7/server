const express = require("express");

module.exports = (db) => {
  const router = express.Router();


  router.put("/posts/:postId", async (req, res) => {
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
      //postPassword, 닉네임, JWT 토큰 중 하나로 수정 권한 확인.
      // if() return res.status(403).json({ message: "비밀번호가 틀렸습니다"});
      
      //POST 테이블 업데이트트
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
         SELECT id, groupId, userId, title, content, imageUrl, location, moment, isPublic, likeCount, commentCount, createdAt
         FROM POST
         WHERE id = ?`,
         [postId]
      );

      //userId를 통해 nickname 받아오기
      const [nicknameRow] = await db.execute(`
            SELECT nickname
            FROM USERS
            WHERE id = ?`,
        [responseRow[0].userId]
      );
      const nickname = nicknameRow[0].nickname;


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
      res.status(400).json({ message: "잘못된 요청입니다" });
    }
  });
  return router;
};
