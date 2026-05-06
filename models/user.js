// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: String,

    email: {
      type: String,
      required: true,
      unique: true, // ✅ important
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    // ✅ ADD THESE FIELDS
    isVerified: {
      type: Boolean,
      default: false,
    },

    verificationToken: String,

    verificationTokenExpires: Date,
  },
  { timestamps: true },
);

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
