const mongoose = require("mongoose");

const volunteerSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    phone: {
      type: String,
      required: true,
    },

    image: {
      type: String, // image path or URL
    },

    skills: [
      {
        type: String,
      },
    ],

    availability: {
      type: String, // e.g. weekends, weekdays
    },

    address: {
      type: String,
    },

    motivation: {
      type: String, // why they want to volunteer
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Volunteer", volunteerSchema);
