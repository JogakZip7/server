const express = require("express");
const jwt = require("jsonwebtoken");

module.exports = (db) => {
  const router = express.Router();
  router.post("/posts/:postId/verify-password", async (req, res) => {
    const { postId } = req.params;
    const token = req.headers.authorization?.split(' ')[1];


    try {
      //유저 아이디 토큰으로 받아옴
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.sub;

      //게시글이 소속되어 있는 그룹 받아옴
      const [groupIdRow] = await db.execute(`
        SELECT groupId FROM POST
        WHERE id = ?        
        `, [postId]
      )
      const groupId = groupIdRow[0].groupId;

      //PARTICIPATE 테이블로 확인
      const [authRow] = await db.execute(`
        SELECT id FROM PARTICIPATE
        WHERE userId = ?, groupId = ?
        `, [userId, groupId]
      )

      //authRow가 존재하면 게시글 조회 권한 O, 없으면 error 발생.
      if(authRow && authRow.length === 1){
        res.status(200).json({ message: "아이디가 확인되었습니다"});
      } else { throw new Error()}
      
    } catch (err) {
      res.status(401).json({ message: "아이디가 틀렸습니다" });
    }
  });
  return router;
};
