const express = require("express");
const auth = require("../../../middleware/auth");

module.exports = (db) => {
  const router = express.Router();
  router.get("/:groupId/posts", auth, async (req, res) => {
    const {groupId} = req.params;
    const {
      page = 1,
      pageSize = 12,
      sortBy = "latest",
      keyword,
      isPublic = true,
    } = req.query;

    
    try {
      const userId = req.user.id;

      //비공개 게시글이 속한 그룹의 사람인지 확인
      const [authRow] = await db.execute(`
        SELECT * FROM PARTICIPATE
        WHERE userId = ? AND groupId = ?
        `, [userId, groupId]
      )
      if(isPublic === false && (!authRow || authRow.length === 0)){
        return res.status(400).json({ message: err || "권한이 없습니다" });
      }

      //총 페이지 수 및 총 게시글 수 카운트
      const [countPost] = await db.execute(
        `
        SELECT COUNT(*) AS totalCount
        FROM POST
        WHERE groupId = ? AND isPublic = ?`,
        [groupId, isPublic ? 1 : 0]
      );
      const totalItemCount = countPost[0].totalCount;
      const totalPages = Math.ceil(totalItemCount / pageSize);
      const offset = (page - 1) * (pageSize);

      // 테이블 정렬 기준 정하기
      let sort = "";
      switch (sortBy) {
        case "latest":
          sort = "createdAt";
          break;
        case "mostCommented":
          sort = "commentCount";
          break;
        case "mostLiked":
          sort = "likeCount";
          break;
        default:
          sort = "createdAt";
      }

      //POST 테이블 정렬 후 페이지에 따른 필터링
      const [result] = await db.query(
        `
          SELECT P.*, U.nickname
          FROM POST P
          JOIN USER U ON P.userId = U.id
          WHERE P.groupId = ? AND P.isPublic = ?
          ORDER BY ${db.escapeId(sort)} DESC
          LIMIT ? OFFSET ?
        `,
        [groupId, isPublic ? 1 : 0, parseInt(pageSize), parseInt(offset)]
      );



      //응답 데이터
      const response = {
        currentPage: page,
        totalPages: totalPages,
        totalItemCount: totalItemCount,
        data: result.map((post) => ({
          id: post.id,
          nickname: post.nickname,
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
