const express = require("express");
const httpProxy = require("http-proxy-middleware");
const app = express();
const PORT = process.env.PORT || 5000;
const routes = require("./routes/routes");
const cors = require("cors");

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  })
);

// Use the routes defined in routes.js
routes(app);

app.use(express.json());

// Example routes
// app.use("/auth", (req, res) => {
//   res.redirect("http://localhost:3001" + req.url);
// });
// app.use("/products", (req, res) => {
//   res.redirect("http://localhost:3002" + req.url);
// });

app.listen(PORT, () => console.log(`Gateway running on ${PORT}`));

app.get("/", (req, res) => {
  res.send("hello");
});
