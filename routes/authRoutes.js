const router = require("express").Router();
const { register, login } = require("../controlers/authController");
const User = require("../models/user"); // 👈 YOU MISSED THIS

// REGISTER
router.post("/register", register);

// VERIFY EMAIL ✅ FIXED
router.get("/verify-email", async (req, res) => {
  try {
    const { token } = req.query;

    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).send("Invalid or expired token");
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;

    await user.save();

    res.send("Email verified successfully!");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// LOGIN
router.post("/login", login);

module.exports = router;
