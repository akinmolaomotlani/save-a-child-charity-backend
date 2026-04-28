const express = require("express");
const router = express.Router();

const {
  sendMessage,
  getConversation,
  getUnreadMessages,
} = require("../controlers/messageController");

// send message
router.post("/send", sendMessage);

// unread messages
router.get("/unread/:id", getUnreadMessages);

// chat between admin and user
router.get("/:adminId/:userId", getConversation);

module.exports = router;
