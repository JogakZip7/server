const express = require("express");
const auth = require("../../../middleware/auth");

module.exports = (db) => {
    const router = express.Router();

    // 게시글 스크랩 라우트
    router.post("/:postId/scrap", auth, async (req, res) => {
        const userId = req.user.id;
        const { postId } = req.params;

        if(!userId || !postId) {
            return res.status(400).json({ message: "잘못된 요청입니다" });
        }

        try {
            // 스크랩 되어 있는지 확인
            const [result] = await db.execute(
                "SELECT * FROM SCRAP WHERE userId = ? AND postId = ?",
                [userId, postId]
            );

            if(result.length > 0) {
                return res.status(404).json({ message: "이미 스크랩한 게시글입니다"})
            }

            // 스크랩 추가 쿼리
            await db.execute(
                "INSERT INTO SCRAP (userId, postId) VALUES (?, ?)",
                [userId, postId]
            );
            
            res.status(200).json({ message: "게시글 스크랩하기 성공" });
        } catch (err) {
            res.status(500).json({ message: err.message || "서버 오류가 발생했습니다" });
        }
    });

    return router;
};