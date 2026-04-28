const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema(
  {
    donorName: String,
    email: String,
    amount: Number,
    currency: {
      type: String,
      default: "usd",
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    paymentIntentId: String,
  },
  { timestamps: true },
);

module.exports = mongoose.model("Donation", donationSchema);
