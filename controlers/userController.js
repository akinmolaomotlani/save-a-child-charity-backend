const User = require("../models/user");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const sendEmail = require("../utils/mailer");

// CREATE USER
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ generate token
    const token = crypto.randomBytes(32).toString("hex");

    // ✅ create user instance (NOT User.create)
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "user",

      // ✅ ADD THESE
      verificationToken: token,
      verificationTokenExpires: Date.now() + 1000 * 60 * 60, // 1 hour
      isVerified: false,
    });

    await user.save();

    // ✅ TODO: send email here (next step)
    const verifyURL = `http://localhost:5000/verify?token=${token}`;

    await sendEmail({
      to: user.email,
      subject: "Verify your account",
      html: `
    <h2>Hello ${user.name}</h2>
    <p>Click below to verify your account:</p>
    <a href="${verifyURL}">Verify Account</a>
  `,
    });
    res.status(201).json({
      success: true,
      message: "User created. Please check your email to verify your account.",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL USERS
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET SINGLE USER
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE USER
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE USER
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ success: true, message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
