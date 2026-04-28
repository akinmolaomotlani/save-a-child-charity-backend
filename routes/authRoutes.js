// routes/authRoutes.js
const router = require("express").Router();
const { register, login } = require("../controlers/authController");

// ✅ CLEAN ROUTES
router.post("/register", register);
router.post("/login", login);
module.exports = router;
