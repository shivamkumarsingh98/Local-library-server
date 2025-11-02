require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3005;

const { connect } = require("./config/db");
const authRoutes = require("./routes/auth");
// const passportSetup = require("./passport/google");

app.use(express.json());

// Connect DB
connect().catch((e) => console.error(e));

// Passport Google
// passportSetup();
// const passport = require("passport");
// app.use(passport.initialize());

// Mount routes
app.use("/", authRoutes);

// Google oauth redirect endpoints
// app.get(
//   "/auth/google",
//   passport.authenticate("google", { scope: ["profile", "email"] })
// );
// app.get(
//   "/auth/google/callback",
//   passport.authenticate("google", { session: false }),
//   (req, res) => {
//     const jwt = require("jsonwebtoken");
//     const secret = process.env.JWT_SECRET || "change-this-secret";
//     const token = jwt.sign(
//       { id: req.user._id, email: req.user.email },
//       secret,
//       { expiresIn: "7d" }
//     );
//     res.json({
//       token,
//       user: { id: req.user._id, name: req.user.name, email: req.user.email },
//     });
//   }
// );

app.get("/", (req, res) => {
  res.send("Server student auth 🚀");
});
app.get("/health", (req, res) => res.json({ status: "ok" }));

app.listen(PORT, () => console.log(`Auth service running on ${PORT}`));
