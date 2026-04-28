const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected");
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

mongoose.connection.once("open", () => {
  console.log("Connected to DB:", mongoose.connection.name);
});

module.exports = connectDB;
