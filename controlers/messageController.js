const Message = require("../models/Message");
const mongoose = require("mongoose"); // ✅ ADD THIS

/* SEND MESSAGE */
exports.sendMessage = async (req, res) => {
  try {
    const { sender, receiver, subject, content, threadId } = req.body;

    if (!sender || !receiver || !content) {
      return res.status(400).json({
        message: "sender, receiver and content required",
      });
    }

    // ✅ FIX STARTS HERE
    const existingThread = await Message.findOne({
      $or: [
        { sender, receiver },
        { sender: receiver, receiver: sender },
      ],
    });

    const finalThreadId =
      threadId || existingThread?.threadId || new mongoose.Types.ObjectId();
    // ✅ FIX ENDS HERE

    const message = await Message.create({
      sender,
      receiver,
      subject: subject || "No Subject",
      content,
      read: false,
      threadId: finalThreadId,
    });

    const populatedMessage = await Message.findById(message._id)
      .populate("sender", "name email")
      .populate("receiver", "name email");

    res.status(201).json({
      success: true,
      message: populatedMessage,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* GET CHAT BETWEEN ADMIN + USER */
exports.getConversation = async (req, res) => {
  try {
    const { adminId, userId } = req.params;

    const messages = await Message.find({
      $or: [
        { sender: adminId, receiver: userId },
        { sender: userId, receiver: adminId },
      ],
    })
      .populate("sender", "name email")
      .populate("receiver", "name email")
      .sort({ createdAt: 1 });

    res.json({ messages });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* GET ALL USER MESSAGES */
exports.getMessages = async (req, res) => {
  try {
    const userId = req.params.id;

    const messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }],
    })
      .populate("sender", "name email")
      .populate("receiver", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      messages,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* GET THREAD MESSAGES (NEW) */
exports.getThreadMessages = async (req, res) => {
  try {
    const { threadId } = req.params;

    const messages = await Message.find({ threadId })
      .populate("sender", "name email")
      .populate("receiver", "name email")
      .sort({ createdAt: 1 });

    res.json({ messages });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* MARK ALL USER MESSAGES AS READ */

exports.markAsRead = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.params.id); // ✅ FIX

    const result = await Message.updateMany(
      {
        receiver: userId,
        read: false,
      },
      {
        $set: { read: true },
      },
    );

    console.log("UPDATED:", result); // ✅ debug

    res.json({ success: true, updated: result.modifiedCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAdminInbox = async (req, res) => {
  try {
    const adminId = req.params.id;

    const messages = await Message.find({
      receiver: adminId,
    })
      .populate("sender", "name email")
      .populate("receiver", "name email")
      .sort({ createdAt: -1 });

    res.json({ success: true, messages });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* DELETE MESSAGE */
exports.deleteMessage = async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
