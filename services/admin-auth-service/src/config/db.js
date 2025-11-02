const mongoose = require("mongoose");

const connect = async (uri) => {
  const MONGO =
    uri || process.env.MONGO || "mongodb://localhost:27017/micro_admin";
  await mongoose.connect(MONGO, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("Admin-auth-service connected to MongoDB");
};

module.exports = { connect };
