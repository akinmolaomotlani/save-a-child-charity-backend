const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const crypto = require("crypto");
const sendEmail = require("../utils/mailer");

// ================= REGISTER =================
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
    const isAdmin = email === "admin@saveachild.org";
    const hashedPassword = await bcrypt.hash(password, 10);

    const token = crypto.randomBytes(32).toString("hex");
    const tokenExpires = Date.now() + 1000 * 60 * 60; // 1 hour

    await User.create({
      name,
      email,
      password: hashedPassword,

      role: isAdmin ? "admin" : "user",

      isVerified: isAdmin ? true : false,

      verificationToken: isAdmin ? null : token,

      verificationTokenExpires: isAdmin ? null : tokenExpires,
    });

    // const verificationLink = `${process.env.CLIENT_URL}/verify?token=${token}`;

    const verificationLink = `${process.env.SERVER_URL}/api/auth/verify?token=${token}`;

    console.log("CLIENT_URL:", process.env.CLIENT_URL);
    console.log("Verification Link:", verificationLink);

    // send email (non-blocking)
    sendEmail({
      to: email,
      subject: "Verify your email",
      html: `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <title>Verify your email</title>
  </head>

  <body style="
    margin:0;
    padding:0;
    background-color:#f3f4f6;
    font-family:Arial,sans-serif;
  ">

    <div style="
      max-width:600px;
      margin:40px auto;
      background:#ffffff;
      border-radius:10px;
      padding:40px;
      box-shadow:0 2px 10px rgba(0,0,0,0.05);
    ">

      <!-- Logo -->
      <div style="text-align:center;margin-bottom:30px;">
        <h1 style="
          margin:0;
          color:#4f46e5;
          font-size:30px;
        ">
          Save A Child
        </h1>
      </div>

      <!-- Heading -->
      <h2 style="
        color:#111827;
        margin-bottom:20px;
      ">
        Verify your email
      </h2>

      <!-- Message -->
      <p style="
        color:#374151;
        font-size:16px;
        line-height:1.7;
      ">
        Thank you for signing up.
      </p>

      <p style="
        color:#374151;
        font-size:16px;
        line-height:1.7;
      ">
        Please confirm your email address by clicking the button below.
      </p>

      <!-- Button -->
      <div style="
        text-align:center;
        margin:35px 0;
      ">
        <a
          href="${verificationLink}"
          style="
            background:#4f46e5;
            color:white;
            padding:14px 28px;
            border-radius:8px;
            text-decoration:none;
            display:inline-block;
            font-size:16px;
            font-weight:bold;
          "
        >
          Confirm my account
        </a>
      </div>

      <!-- Fallback -->
      <p style="
        color:#6b7280;
        font-size:14px;
      ">
        If the button doesn't work, copy and paste this link into your browser:
      </p>

      <p style="
        word-break:break-all;
        font-size:14px;
      ">
        <a href="${verificationLink}">
          ${verificationLink}
        </a>
      </p>

      <!-- Footer -->
      <hr style="
        border:none;
        border-top:1px solid #e5e7eb;
        margin:30px 0;
      ">

      <p style="
        text-align:center;
        color:#9ca3af;
        font-size:13px;
      ">
        If you didn’t request this email, you can safely ignore it.
      </p>

    </div>
  </body>
  </html>
  `,
    }).catch((err) => console.error("Email failed:", err));

    return res.status(201).json({
      message: "User registered successfully. Please verify your email.",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ================= LOGIN =================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // enforce verification
    if (!user.isVerified) {
      return res.status(403).json({
        message: "Please verify your email first",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "7d" },
    );

    return res.status(200).json({
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
    return res.status(500).json({ message: "Server error" });
  }
};

// ================= VERIFY USER =================
exports.verifyUser = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.redirect(
        `${process.env.CLIENT_URL}/verify-email?success=false`,
      );
    }

    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.redirect(`${process.env.CLIENT_URL}/verify?success=false`);
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;

    await user.save();

    return res.redirect(`${process.env.CLIENT_URL}/verify?success=true`);
  } catch (error) {
    console.error(error);

    return res.redirect(`${process.env.CLIENT_URL}/verify?success=false`);
  }
};
