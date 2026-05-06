const express = require("express");
const router = express.Router();

const {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  createUser,
  verifyUser,
} = require("../controlers/userController");

// GET all users
router.get("/", getUsers);

//VERIFY ROUTER
router.get("/verify", verifyUser);

// GET single user
router.get("/:id", getUserById);

// UPDATE user
router.put("/:id", updateUser);

// DELETE user
router.delete("/:id", deleteUser);

//ADD USER
router.post("/", createUser);

module.exports = router;
