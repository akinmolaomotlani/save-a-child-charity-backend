const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const sendEmail = require("../utils/mailer");

// REGISTER
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const token = crypto.randomBytes(32).toString("hex");
    const tokenExpires = Date.now() + 1000 * 60 * 60;

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      verificationToken: token,
      verificationTokenExpires: tokenExpires,
    });

    const verificationLink = `https://save-a-child-charity-backend.onrender.com/verify?token=${token}`;

    // 🔥 CRITICAL FIX: don't let email block response
    sendEmail({
      to: user.email,
      subject: "Verify your email",
      html: `
        <p>Click the link below to verify your email:</p>
        <a href="${verificationLink}">${verificationLink}</a>
      `,
    }).catch((err) => console.error("Email failed:", err));

    const jwtToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "7d" },
    );

    // return res.status(201).json({
    //   message: "User registered successfully. Please verify your email.",
    //   token: jwtToken,
    //   user: {
    //     id: user._id,
    //     name: user.name,
    //     email: user.email,
    //     role: user.role,
    //   },
    // });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    // find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 🔥 ADD THIS HERE (IMPORTANT)
    if (!user.isVerified) {
      return res.status(403).json({
        message: "Please verify your email first",
      });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // create token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "7d" },
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.verifyUser = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.redirect(
        "https://save-a-child-charity-frontend.vercel.app/verify?success=false",
      );
    }

    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.redirect(
        "https://save-a-child-charity-frontend.vercel.app/verify?success=false",
      );
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;

    await user.save();

    // ✅ SUCCESS REDIRECT
    res.redirect(
      "https://save-a-child-charity-frontend.vercel.app/verify?success=true",
    );
  } catch (error) {
    res.redirect(
      "https://save-a-child-charity-frontend.vercel.app/verify?success=false",
    );
  }
};
