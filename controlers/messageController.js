const Message = require("../models/Message");

/* SEND MESSAGE */
exports.sendMessage = async (req, res) => {
  try {
    const { sender, receiver, subject, content } = req.body;

    if (!sender || !receiver || !content) {
      return res.status(400).json({
        message: "sender, receiver and content required",
      });
    }

    const message = await Message.create({
      sender,
      receiver,
      subject: subject || "No Subject",
      content,
      read: false,
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

    res.json({ messages });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* GET UNREAD USER MESSAGES */
exports.getUnreadMessages = async (req, res) => {
  try {
    const userId = req.params.id;

    const messages = await Message.find({
      receiver: userId,
      read: false,
    })
      .populate("sender", "name email")
      .sort({ createdAt: -1 });

    res.json({ messages });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* MARK ALL USER MESSAGES AS READ */
exports.markAsRead = async (req, res) => {
  try {
    const userId = req.params.id;

    await Message.updateMany(
      {
        receiver: userId,
        read: false,
      },
      {
        $set: { read: true },
      },
    );

    res.json({ success: true });
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
