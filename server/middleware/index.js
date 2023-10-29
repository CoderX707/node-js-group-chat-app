const jwt = require("jsonwebtoken");

function authorizeUser(req, res, next) {
  const token = req.header("Authorization") || req.header("authorization");
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }
  try {
    const decoded = jwt.verify(token.split("Bearer ")[1], process.env.SECRET_KEY);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
}

function adminAuthMiddleware(req, res, next) {
  if (req.user && req.user.isAdmin === true) {
    next();
  } else {
    res.status(403).json({ message: "Access forbidden" });
  }
}

module.exports = { authorizeUser, adminAuthMiddleware };
