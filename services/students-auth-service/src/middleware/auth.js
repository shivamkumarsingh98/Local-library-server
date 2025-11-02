const jwt = require("jsonwebtoken");
const User = require("../models/user");
const secret = process.env.JWT_SECRET || "change-this-secret";

module.exports = async function auth(req, res, next) {
  const h = req.headers.authorization;
  if (!h)
    return res.status(401).json({ error: "missing authorization header" });
  const parts = h.split(" ");
  if (parts.length !== 2)
    return res.status(401).json({ error: "bad authorization format" });
  const token = parts[1];
  try {
    const payload = jwt.verify(token, secret);
    const user = await User.findById(payload.id);
    if (!user) return res.status(401).json({ error: "user not found" });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: "invalid token" });
  }
};
