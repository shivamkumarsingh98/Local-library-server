const Admin = require("../models/admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const secret = process.env.JWT_SECRET || "change-this-secret";

exports.login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: "missing fields" });
  const admin = await Admin.findOne({ username });
  if (!admin) return res.status(400).json({ error: "invalid credentials" });
  const ok = await bcrypt.compare(password, admin.passwordHash);
  if (!ok) return res.status(400).json({ error: "invalid credentials" });
  const token = jwt.sign({ id: admin._id, username: admin.username }, secret, {
    expiresIn: "7d",
  });
  res.json({ token, admin: { id: admin._id, username: admin.username } });
};
