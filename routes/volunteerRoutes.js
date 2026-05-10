const express = require("express");

const router = express.Router();

const upload = require("../middleware/upload");

const {
  createVolunteer,
  getVolunteers,
  getVolunteerById,
  updateVolunteerStatus,
  approveVolunteer,
  rejectVolunteer,
  deleteVolunteer,
} = require("../controllers/volunteerController");

// CREATE
router.post("/", upload.single("image"), createVolunteer);

// GET ALL
router.get("/", getVolunteers);

// GET SINGLE
router.get("/:id", getVolunteerById);

// UPDATE STATUS
router.put("/:id/status", updateVolunteerStatus);

// APPROVE
router.patch("/:id/approve", approveVolunteer);

// REJECT
router.patch("/:id/reject", rejectVolunteer);

// DELETE
router.delete("/:id", deleteVolunteer);

module.exports = router;
