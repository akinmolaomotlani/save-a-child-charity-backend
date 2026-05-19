const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    reference: {
      type: String,
      required: true,
      unique: true,
    },

    status: {
      type: String,
      default: "pending",
    },

    paidAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

const Donation =
  mongoose.models.Donation || mongoose.model("Donation", donationSchema);

module.exports = Donation;
