const mongoose = require("mongoose");

const connect = async (uri) => {
  const MONGO =
    uri || process.env.MONGO || "mongodb://localhost:27017/micro_auth";
  await mongoose.connect(MONGO, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("Auth-service connected to MongoDB");
};

module.exports = { connect };
