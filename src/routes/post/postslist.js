const express = require("express");

module.exports = (db) => {
  const router = express.Router();
  router.get("/groups/:groupId/posts", async (req, res) => {
    const { page, pageSize, sortBy, keyword, isPublic, groupId, userId } =
      req.params;

    try {
    } catch (err) {
      res.status(400).json({ message: "잘못된 요청입니다" });
    }
  });
  return router;
};
