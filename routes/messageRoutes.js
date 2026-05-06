const express = require("express");
const router = express.Router();

const {
  sendMessage,
  getMessages,
  deleteMessage,
  markAsRead,
  getConversation,
  getThreadMessages,
  getAdminInbox,
} = require("../controlers/messageController");

/* SEND */
router.post("/send", sendMessage);

//GET ADMIN INBOX
router.get("/inbox/:id", getAdminInbox);

/* MARK READ */
router.put("/read/:id", markAsRead);

/* THREAD */
router.get("/thread/:threadId", getThreadMessages);

/* CONVERSATION */
router.get("/conversation/:adminId/:userId", getConversation);

/* GET USER MESSAGES */
router.get("/:id", getMessages);

/* DELETE */
router.delete("/:id", deleteMessage);

module.exports = router;
