const router = require("express").Router();
const { register, login, verifyUser } = require("../controlers/authController");
const User = require("../models/user"); // 👈 YOU MISSED THIS

// REGISTER
router.post("/register", register);

// LOGIN
router.post("/login", login);
router.post("/verify-email", verifyUser);

module.exports = router;
