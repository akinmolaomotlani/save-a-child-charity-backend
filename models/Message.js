const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    subject: {
      type: String,
      default: "No Subject",
    },

    content: {
      type: String,
      required: true,
    },

    read: {
      type: Boolean,
      default: false,
    },
    threadId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Message", MessageSchema);
