const mongoose = require("mongoose");

const librarySchema = new mongoose.Schema({
  librariename: { type: String, required: true },
  city: { type: String, required: true },
  area: {type: String, required: true},
  images: [{ type: String, required: true }], // ✅ array for multiple Cloudinary URLs
  services: [{ type: String, required: true }], // ✅ array (e.g. ['WiFi', 'AC'])
  location: { type: String, required: true },
  description: { type: String, required: true },
  time: { type: String,  },
  totalseats: { type: Number, required: true },
  availableseats: { type: Number, required: true },
  trial: { type: Number, required: true },
  price: [
    {
      type: {
        type: String, // e.g., 'Normal', 'Premium'
      },
      oneMonth: Number,
      threeMonths: Number,
      sixMonths: Number,
      twelveMonths: Number,
    },
  ],
  shifts: [
    {
      name: { type: String, default: "Default Shift" },
      start: { type: String },
      end: { type: String },
    },
  ],
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Owner",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("LibrariesModel", librarySchema);
