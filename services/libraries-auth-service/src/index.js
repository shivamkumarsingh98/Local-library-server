require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3004;
const cors = require("cors");

const { connect } = require("./config/db");
const ownerRoutes = require("./routes/owner");
const libraryRoutes = require("./routes/LibrarieRoute");
// const passportSetup = require("./passport/google");
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3000"],
    credentials: true,
  })
);
app.use(express.json());

connect().catch((e) => console.error(e));

// passportSetup();
// const passport = require("passport");
// app.use(passport.initialize());

app.use("/", ownerRoutes);
app.use("/api", libraryRoutes);

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
//       owner: { id: req.user._id, name: req.user.name, email: req.user.email },
//     });
//   }
// );

app.get("/health", (req, res) => res.json({ status: "ok" }));

app.get("/", (req, res) => {
  res.send("Server is live 🚀");
});

app.listen(PORT, () => console.log(`Owner service running on ${PORT}`));
