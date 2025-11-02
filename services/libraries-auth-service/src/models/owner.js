const mongoose = require("mongoose");

const ownerSchema = new mongoose.Schema({
  name: { type: String },
  mobile: { type: Number, required: true, unique: true },
  email: { type: String, required: true, default: null, unique: true },
  passwordHash: { type: String },
  googleId: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Owner", ownerSchema);
