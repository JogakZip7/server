const express = require("express");

module.exports = (db) => {
  const router = express.Router();
  router.put("/posts/:postId", async (req, res) => {
    const {
      title,
      content,
      postPassword,
      imageUrl,
      location,
      moment,
      isPublic,
    } = req.body;

    try {
      // if() return res.status(403).json({ message: "비밀번호가 틀렸습니다"});
      // if() return res.status(404).json({ message: "존재하지 않습니다"});
    } catch (err) {
      res.status(400).json({ message: "잘못된 요청입니다" });
    }
  });
};
