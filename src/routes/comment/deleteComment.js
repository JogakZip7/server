const express = require("express");
const auth = require("../../../middleware/auth");

module.exports = (db) => {
    const router = express.Router();
    
    router.delete("/comments/:commentId", auth, async (req, res) => {
        const { commentId } = req.params;

        if (!commentId) {
            return res.status(400).json({ message: "잘못된 요청입니다" });
        }

        try {
            // 댓글 삭제 쿼리
            const [result] = await db.execute(
                "DELETE FROM COMMENT WHERE id = ?",
                [commentId]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "존재하지 않습니다" });
            }

            res.status(200).json({ message: "답글 삭제 성공" });
        } catch (err) {
            res.status(500).json({ message: err.message || "서버 오류가 발생했습니다" });
        }
    });

    return router;
};