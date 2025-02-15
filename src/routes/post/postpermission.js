const express = require("express");

module.exports = (db) => {
  const router = express.Router();
  router.post("/posts/:postId/verify-password", async (req, res) => {
    const { postId } = req.params;

    try {

      
      
    } catch (err) {
      res.status(401).json({ message: "아이디가 틀렸습니다" });
    }
  });
};
