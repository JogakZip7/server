const express = require("express");
const auth = require("../../../middleware/auth");

module.exports = (db) => {
  const router = express.Router();
  router.get("/:groupId/posts", auth, async (req, res) => {
    const {
      page = 1,
      pageSize = 12,
      sortBy = "latest",
      keyword,
      isPublic = true,
      groupId,
    } = req.params;

    
    try {
      
      const userId = req.user.id;

      //PARTICIPATE 테이블로 확인
      const [authRow] = await db.execute(`
        SELECT * FROM PARTICIPATE
        WHERE userId = ? AND groupId = ?
        `, [userId, groupId]
      )
      if(!authRow || authRow.length !== 1){
        throw new Error();
      }









      //총 페이지 수 및 총 게시글 수 카운트
      const [countPost] = await db.execute(
        `
        SELECT COUNT(*) AS totalCount
        FROM POST
        WHERE groupId = ? AND isPublic = ?`,
        [groupId, isPublic]
      );
      const totalItemCount = countPost[0].totalCount;
      const totalPages = Math.ceil(totalItemCount / pageSize);

      // 테이블 정렬 기준 정하기
      let sort = "";
      switch (sortBy) {
        case "latest":
          sort = "ORDER BY createdAt DESC";
          break;
        case "mostCommented":
          sort = "ORDER BY commentCount DESC";
          break;
        case "mostLiked":
          sort = "ORDER BY likeCount DESC";
          break;
        default:
          sort = "ORDER BY createdAt DESC";
      }

      //POST 테이블 정렬 후 페이지에 따른 필터링
      const [result] = await db.execute(
        `
        SELECT * FROM POST
        WHERE groupId = ? AND isPublic = ?
        ${sort}
        LIMIT ? OFFSET ?`,
        [groupId, isPublic, pageSize, (page - 1) * pageSize]
      );

      //(임시용)userId를 통해 nickname 받아오기->post테이블에 닉네임 추가 예정
      const [nicknameRow] = await db.execute(
        `
        SELECT nickname
        FROM USERS
        WHERE id = ?`,
        [userId]
      );
      const nickname = nicknameRow[0]?.nickname;

      //응답 데이터
      const response = {
        currentPage: page,
        totalPages: totalPages,
        totalItemCount: totalItemCount,
        data: result.map((post) => ({
          id: post.id,
          nickname: nickname, //테이블 nickname 추가. 수정 필요.
          title: post.title,
          imageUrl: post.imageUrl,
          location: post.location,
          moment: post.moment,
          isPublic: post.isPublic,
          likeCount: post.likeCount,
          commentCount: post.commentCount,
          createdAt: post.createdAt,
        })),
      };

      res.status(200).json(response);
    } catch (err) {
      res.status(400).json({ message: err || "잘못된 요청입니다" });
    }
  });
  return router;
};
