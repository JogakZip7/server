const express = require("express");

module.exports = (db) => {
  const router = express.Router();
  router.get("/posts/:postId", async (req, res) => {
    const { postId } = req.params;

    try {

      
      
    } catch (err) {
      res.status(400).json({ message: "잘못된 요청입니다" });
    }
  });
  return router;
};
