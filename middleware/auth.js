const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  // 토큰의 id, nickname 정보를 req.user에 저장
    next();
  } catch (err) {
    console.error("Invalid token", err);
    res.status(401).json({ message: "Invalid token" });
  }
};
