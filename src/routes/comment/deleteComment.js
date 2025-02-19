const express = require("express");
const auth = require("../../../middleware/auth");

module.exports = (db) => {
    const router = express.Router();
    
    // 댓글 삭제 라우트
    router.delete("/:commentId", auth, async (req, res) => {
        const { commentId } = req.params;

        if (!commentId) {
            return res.status(400).json({ message: "잘못된 요청입니다" });
        }

        try {
            // 삭제하려는 댓글의 postId 조회 쿼리
            const [deleteComment] = await db.query(
                "SELECT postId FROM COMMENT WHERE id = ?",
                [commentId]
            );

            if (deleteComment.length === 0) {
                return res.status(404).json({ message: "존재하지 않습니다" });
            }

            // 댓글 삭제 쿼리
            await db.execute(
                "DELETE FROM COMMENT WHERE id = ?",
                [commentId]
            );

            // 댓글이 삭제되면 해당 게시글의 commentCount 감소
            await db.execute(
                "UPDATE POST SET commentCount = commentCount - 1 WHERE id = ?",
                [deleteComment[0].postId]
            );

            res.status(200).json({ message: "댓글 삭제 성공" });
        } catch (err) {
            res.status(500).json({ message: err.message || "서버 오류가 발생했습니다" });
        }
    });

    return router;
};