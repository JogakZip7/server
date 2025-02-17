const express = require("express");
const auth = require("../../../middleware/auth");

module.exports = (db) => {
    const router = express.Router();
    
    router.put("/comments/:commentId", auth, async (req, res) => {
        const { commentId } = req.params;
        const { content } = req.body;

        if (!commentId || !content) {
            return res.status(400).json({ message: "잘못된 요청입니다" });
        }

        try {
            const nickname = req.user.nickname;

            // 댓글 수정 쿼리
            const [result] = await db.execute(
                "UPDATE COMMENT SET content = ? WHERE id = ?",
                [content, commentId]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "존재하지 않습니다" });
            }

            // 수정된 댓글 정보 조회
            const [updateComment] = await db.execute(
                "SELECT id, content, createdAt FROM COMMENT WHERE id = ?",
                [commentId]
            );

            // 응답 형식에 맞게 반환
            const response = {
                id: updateComment[0].id,
                nickname: nickname,
                content: updateComment[0].content,
                createdAt: new Date(updateComment[0].createdAt).toISOString()
            }

            res.status(200).json(response);
        } catch (err) {
            res.status(500).json({ message: err.message || "서버 오류가 발생했습니다" });
        }
    });

    return router;
};