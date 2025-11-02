const jwt = require("jsonwebtoken");
const Owner = require("../models/owner");
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
    const owner = await Owner.findById(payload.id);
    if (!owner) return res.status(401).json({ error: "owner not found" });
    req.owner = owner;
    next();
  } catch (err) {
    return res.status(401).json({ error: "invalid token" });
  }
};
