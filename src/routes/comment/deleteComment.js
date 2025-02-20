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
            const userId = req.user.id;

            // 댓글 작성자인지 확인 및 postId 조회
            const [deleteComment] = await db.execute(
                "SELECT userId, postId FROM COMMENT WHERE id = ?",
                [commentId]
            );

            if (deleteComment[0].userId !== userId) {
                return res.status(403).json({ message: "삭제 권한이 없습니다" });
            }

            // 댓글 삭제
            const [result] = await db.execute(
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