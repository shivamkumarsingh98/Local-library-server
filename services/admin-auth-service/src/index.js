require("dotenv").config();
const express = require("express");
const bcrypt = require("bcryptjs");
const app = express();
const PORT = process.env.PORT || 3005;

const { connect } = require("./config/db");
const Admin = require("./models/admin");
const adminRoutes = require("./routes/admin");

app.use(express.json());

connect().catch((e) => console.error(e));

// Create hard-coded admin if not exists (values can be provided via env)
(async () => {
  const username = process.env.ADMIN_USERNAME || "admin";
  const password = process.env.ADMIN_PASSWORD || "admin123";
  const existing = await Admin.findOne({ username }).catch(() => null);
  if (!existing) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    await Admin.create({ username, passwordHash: hash });
    console.log(`Created admin user: ${username}`);
  } else {
    console.log("Admin user exists");
  }
})();

app.use("/", adminRoutes);

app.get("/health", (req, res) => res.json({ status: "ok" }));

app.listen(PORT, () => console.log(`Admin-auth service running on ${PORT}`));
