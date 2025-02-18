const express = require("express");
const auth = require("../../../middleware/auth");

module.exports = (db) => {
    const router = express.Router();
    
    // 댓글 조회 라우트
    router.get("/:postId/comments", auth, async (req, res) => {
        const { postId } = req.params;
        let { page, pageSize } = req.query;

        if (!postId || !page || !pageSize) {
            return res.status(400).json({ message: "잘못된 요청입니다" });
        }

        page = parseInt(page, 10);
        pageSize = parseInt(pageSize, 10);

        if (isNaN(page) || isNaN(pageSize) || page < 1 || pageSize < 1) {
            return res.status(400).json({ message: "잘못된 요청입니다" });
        }

        try {
            // 전체 댓글 수 조회
            const [totalCountResult] = await db.execute(
                "SELECT COUNT(*) AS totalCount FROM COMMENT WHERE postId = ?",
                [postId]
            );

            const totalItemCount = totalCountResult[0].totalCount;
            const totalPages = Math.ceil(totalItemCount / pageSize);

            // 댓글 목록 조회
            const [comments] = await db.execute(
                "SELECT c.id, u.nickname, c.content, c.createdAt " +
                "FROM COMMENT c JOIN USER u ON c.userId = u.id " +
                "WHERE c.postId = ? " +
                "ORDER BY createdAt DESC " + // 최신순으로 정렬
                "LIMIT ? OFFSET ?",
                [postId, pageSize, (page - 1) * pageSize]
            );

            // 응답 형식에 맞게 반환
            const response = {
                currentPage: page,
                totalPages: totalPages,
                totalItemCount: totalItemCount,
                data: comments.map(comment => ({
                    id: comment.id,
                    nickname: comment.nickname,
                    content: comment.content,
                    createdAt: new Date(comment.createdAt).toISOString()
                }))
            };

            res.status(200).json(response);           
        } catch (err) {
            res.status(500).json({ message: err.message || "서버 오류가 발생했습니다" });
        }
    });

    return router;
};