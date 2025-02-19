const express = require("express");
const auth = require("../../../middleware/auth");

module.exports = (db) => {
  const router = express.Router();

  router.get("/:groupId", auth, async (req, res) => {
    try {
      const userId = req.user.id;
      const { groupId } = req.params;
      if (!groupId) throw { status: 400, message: "잘못된 요청입니다" };

      const [groupRows] = await db.execute("SELECT * FROM `GROUP` WHERE id = ?", [groupId]);
      if (!groupRows.length) throw { status: 404, message: "존재하지 않는 그룹입니다" };

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

      res.status(200).json({ id, name, imageUrl, badges: existingBadges, postCount, introduction });
    } catch (err) {
      res.status(err.status || 500).json({ message: err.message || "서버 오류가 발생했습니다" });
    }
  });

  return router;
};
