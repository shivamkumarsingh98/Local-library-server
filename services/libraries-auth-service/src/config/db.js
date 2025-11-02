const mongoose = require("mongoose");

const connect = async (uri) => {
  const MONGO = uri || process.env.MONGODB_URI;
  await mongoose.connect(MONGO, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("Owner-service connected to MongoDB");
};

module.exports = { connect };
