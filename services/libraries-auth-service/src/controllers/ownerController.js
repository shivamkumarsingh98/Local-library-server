const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Owner = require("../models/owner");
const secret = process.env.JWT_SECRET || "change-this-secret";

function signToken(owner) {
  return jwt.sign({ id: owner._id, mobile: owner.mobile }, secret, {
    expiresIn: "7d",
  });
}

// REGISTER OWNER
exports.register = async (req, res) => {
  try {
    const { name, email, mobile, password, confirmPassword } = req.body;

    if (!name || !email || !mobile || !password || !confirmPassword)
      return res.status(400).json({ error: "All fields are required" });

    if (password !== confirmPassword)
      return res.status(400).json({ error: "Passwords do not match" });

    // check duplicate email
    const existingEmail = await Owner.findOne({ email });
    if (existingEmail)
      return res.status(400).json({ error: "Email already registered" });

    // check duplicate mobile
    const existingMobile = await Owner.findOne({ mobile });
    if (existingMobile)
      return res
        .status(400)
        .json({ error: "Mobile number already registered" });

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const owner = await Owner.create({
      name,
      email,
      mobile,
      passwordHash: hash,
    });

    const token = signToken(owner);

    res.json({
      token,
      owner: {
        id: owner._id,
        name: owner.name,
        email: owner.email,
        mobile: owner.mobile,
      },
    });
  } catch (err) {
    console.error("Registration error:", err);
    // Handle duplicate key error (in case MongoDB throws it)
    if (err.code === 11000) {
      if (err.keyPattern?.email)
        return res.status(400).json({ error: "Email already exists" });
      if (err.keyPattern?.mobile)
        return res.status(400).json({ error: "Mobile number already exists" });
    }
    res.status(500).json({ error: "Server error" });
  }
};

// LOGIN OWNER (via mobile + password)
exports.login = async (req, res) => {
  try {
    const { mobile, password } = req.body;

    if (!mobile || !password)
      return res.status(400).json({ error: "Missing fields" });

    const owner = await Owner.findOne({ mobile });
    if (!owner) return res.status(400).json({ error: "Invalid credentials" });

    const ok = await bcrypt.compare(password, owner.passwordHash || "");
    if (!ok) return res.status(400).json({ error: "Invalid credentials" });

    const token = signToken(owner);

    res.json({
      token,
      owner: {
        id: owner._id,
        name: owner.name,
        email: owner.email,
        mobile: owner.mobile,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// PROFILE
exports.profile = async (req, res) => {
  const o = req.owner;
  res.json({
    id: o._id,
    name: o.name,
    email: o.email,
    mobile: o.mobile,
  });
};

// CHANGE PASSWORD
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmNewPassword)
      return res.status(400).json({ error: "Missing fields" });

    if (newPassword !== confirmNewPassword)
      return res.status(400).json({ error: "New passwords do not match" });

    const ok = await bcrypt.compare(
      currentPassword,
      req.owner.passwordHash || ""
    );
    if (!ok) return res.status(400).json({ error: "Current password invalid" });

    const salt = await bcrypt.genSalt(10);
    req.owner.passwordHash = await bcrypt.hash(newPassword, salt);
    await req.owner.save();

    res.json({ ok: true });
  } catch (err) {
    console.error("Change password error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
