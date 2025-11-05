const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const secret = process.env.JWT_SECRET || "change-this-secret";

function signToken(user) {
  return jwt.sign({ id: user._id, email: user.email }, secret, {
    expiresIn: "7d",
  });
}

exports.register = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    if (!email || !password || !confirmPassword)
      return res.status(400).json({ error: "missing fields" });
    if (password !== confirmPassword)
      return res.status(400).json({ error: "passwords do not match" });
    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ error: "email already registered" });
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const user = await User.create({ name, email, passwordHash: hash });
    const token = signToken(user);
    return res.status(200).json({
      success: true,
      message: "User registered successfully",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message || "Server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "missing fields" });
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "invalid credentials" });
    const ok = await bcrypt.compare(password, user.passwordHash || "");
    if (!ok) return res.status(400).json({ error: "invalid password" });
    const token = signToken(user);
    return res.status(200).json({
      success: true,
      message: "Welcome again",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: error.message || "Server error" });
  }
};

exports.profile = async (req, res) => {
  const u = req.user;
  return res.status(200).json({ id: u._id, name: u.name, email: u.email });
};

exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword, confirmNewPassword } = req.body;
  if (!currentPassword || !newPassword || !confirmNewPassword)
    return res.status(400).json({ error: "missing fields" });
  if (newPassword !== confirmNewPassword)
    return res.status(400).json({ error: "new passwords do not match" });
  const ok = await bcrypt.compare(currentPassword, req.user.passwordHash || "");
  if (!ok) return res.status(400).json({ error: "current password invalid" });
  const salt = await bcrypt.genSalt(10);
  req.user.passwordHash = await bcrypt.hash(newPassword, salt);
  await req.user.save();
  res.json({ ok: true });
};
