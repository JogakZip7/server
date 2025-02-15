const express = require("express");

module.exports = (db) => {
  const router = express.Router();
  router.post("/posts/:postId/like", async (req, res) => {
    const { postId, Id } = req.params;

    try {

      
      
    } catch (err) {
      res.status(404).json({ message: "존재하지 않습니다" });
    }
  });
  return router;
};
