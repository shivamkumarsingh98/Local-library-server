const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { createLibraries } = require("../controllers/LibrariesAddControllers");

// ✅ Ensure upload directory exists (Render-safe fix)
const uploadDir = path.join(__dirname, "../Public/temp");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ✅ Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // use the ensured path
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

// ✅ Filter allowed formats
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only jpg, png, and webp formats are allowed!"), false);
  }
};

const upload = multer({ storage, fileFilter });

// ✅ Route
router.post("/create", upload.array("images", 5), createLibraries);

module.exports = router;
