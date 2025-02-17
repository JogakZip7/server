const express = require("express");
const auth = require("../../../middleware/auth");

module.exports = (db) => {
    const router = express.Router();

    // 댓글 등록 라우트
    router.post("/:postId/comments", auth, async (req, res) => {
        const userId = req.user.id;
        const { postId } = req.params;
        const { content } = req.body;

        if (!userId || !postId || !content) {
            return res.status(400).json({ message: "잘못된 요청입니다" });
        }

        try {
            const nickname = req.user.nickname;

            // 댓글 등록 쿼리
            const [result] = await db.execute(
                "INSERT INTO COMMENT (postId, userId, content, createdAt) VALUES (?, ?, ?, NOW())",
                [postId, userId, content]
            );

            // 새로 등록된 댓글 정보 조회
            const [newComment] = await db.execute(
                "SELECT id, content, createdAt FROM COMMENT WHERE id = ?",
                [result.insertId]
            );
            
            // 응답 형식에 맞게 반환
            const response = {
                id: newComment[0].id,
                nickname: nickname,
                content: newComment[0].content,
                createdAt: new Date(newComment[0].createdAt).toISOString()
            }

            res.status(200).json(response);
        } catch (err) {
            res.status(500).json({ message: err.message || "서버 오류가 발생했습니다" });
        }
    });

    return router;
};