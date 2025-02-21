const express = require("express");
const auth = require("../../../middleware/auth");

module.exports = (db) => {
  const router = express.Router();

  router.get("/:groupId/details", auth, async (req, res) => {
    try {
      const userId = req.user.id;
      const { groupId } = req.params;

      //그룹 번호가 잘못됐거나 존재하지 않는 그룹인 경우
      if (!groupId) throw { status: 400, message: "잘못된 요청입니다" };

      const [groupRows] = await db.query("SELECT * FROM `GROUP` WHERE id = ?", [groupId]);
      if (!groupRows.length) throw { status: 404, message: "존재하지 않는 그룹입니다" };


      //그룹 자체 정보를 받아오는 코드 시작 (게시글 제외)
      const { id, name, imageUrl, postCount, introduction, badges, memberCount } = groupRows[0];

      let existingBadges = [];
      if (badges) {
        if (typeof badges === "string") {
          existingBadges = JSON.parse(badges);
        } else if (Array.isArray(badges)) {
          existingBadges = badges;
        }
      }

      // group 내 likeCount
      const [likeCountRow] = await db.execute(
        "SELECT SUM(likeCount) AS totalLikes FROM POST WHERE groupId = ?",
        [groupId]
      );
 
      let totalLikes = likeCountRow[0]?.totalLikes;
      if (totalLikes === null || totalLikes === undefined) {
        totalLikes = 0;
      }
 
      let updated = false;
      // 그룹 인원수 10명 달성
      if (memberCount >= 10 && !existingBadges.includes("그룹 인원수 10명 달성")) {
        existingBadges.push("그룹 인원수 10명 달성");
        updated = true;
      }
      // 게시글 공감 20개 이상 받기
      if (totalLikes >= 20 && !existingBadges.includes("게시글 공감 20개 이상 받기")) {
        existingBadges.push("게시글 공감 20개 이상 받기");
        updated = true;
      }
 
      if (updated) {
        await db.execute("UPDATE `GROUP` SET badges = ? WHERE id = ?", [JSON.stringify(existingBadges), groupId]);
      }


      //그룹 내 게시글 관련 코드 시작.
      //게시글 정렬 기준 받아옴
      const {
        page = 1,
        pageSize = 8,
        sortBy = "latest",
      } = req.query;
      
      //게시글 관련 응답에 사용할 변수 선언
      let result;

      let totalItemCount;
      let totalPages;
      let offset;

      // 테이블 정렬 기준 정하기
      let sort = "";
      switch (sortBy) {
        case "latest":
          sort = "P.createdAt";
          break;
        case "mostCommented":
          sort = "P.commentCount";
          break;
        case "mostLiked":
          sort = "P.likeCount";
          break;
        default:
          sort = "P.createdAt";
      }

      
      //유저가 그룹 내 사람인지 체크
      const [participation] = await db.execute(
        "SELECT * FROM PARTICIPATE WHERE userId = ? AND groupId = ?",
        [userId, groupId]
      );
      
      
      //유저가 그룹 내 사람이 아닌 경우 공개게시글만 리턴
      if (!participation.length) {
        
        //공개 게시글 총 페이지 수 및 총 게시글 수 카운트
        const [countPost] = await db.query(`
         SELECT COUNT(*) AS totalCount
         FROM POST
         WHERE groupId = ? AND isPublic = 1`,
         [groupId]
       );

       totalItemCount = countPost[0].totalCount;
       totalPages = Math.ceil(totalItemCount / pageSize);
       offset = (page - 1) * (pageSize);

      //POST 테이블 정렬 후 페이지에 따른 필터링
      const [resultRow] = await db.query(
        `
          SELECT P.*, U.nickname
          FROM POST P
          JOIN USER U ON P.userId = U.id
          WHERE P.groupId = ? AND P.isPublic = 1
          ORDER BY ${db.escapeId(sort)} DESC
          LIMIT ? OFFSET ?
        `,
        [groupId, parseInt(pageSize), parseInt(offset)]
      );
      result = resultRow;

      } else{ //유저가 그룹 내 사람인 경우 (모든 그룹 게시물 리턴)
        
        //모든 게시글 총 페이지 수 및 총 게시글 수 카운트
        const [countPost] = await db.query(`
          SELECT COUNT(*) AS totalCount
          FROM POST
          WHERE groupId = ?`,
          [groupId]
        );
 
        totalItemCount = countPost[0].totalCount;
        totalPages = Math.ceil(totalItemCount / pageSize);
        offset = (page - 1) * (pageSize);
 
       //POST 테이블 정렬 후 페이지에 따른 필터링
       const [resultRow] = await db.query(
         `
           SELECT P.*, U.nickname
           FROM POST P
           JOIN USER U ON P.userId = U.id
           WHERE P.groupId = ?
           ORDER BY ${db.escapeId(sort)} DESC
           LIMIT ? OFFSET ?
         `,
         [groupId, parseInt(pageSize), parseInt(offset)]
       );

       result = resultRow;


      }

      //response 객체
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

      res.status(200).json({ id, name, imageUrl, badges: existingBadges, postCount, introduction, response });
    } catch (err) {
      res.status(err.status || 500).json({ message: err.message || "서버 오류가 발생했습니다" });
    }
  });

  return router;
};
