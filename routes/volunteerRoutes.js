const express = require("express");
const router = express.Router();

const {
  createVolunteer,
  getVolunteers,
  getVolunteerById,
  updateVolunteerStatus,
  deleteVolunteer,
} = require("../controlers/volunteerController");

const upload = require("../middleware/upload");

// CREATE (with image)
router.post("/", upload.single("image"), createVolunteer);

// READ
router.get("/", getVolunteers);
router.get("/:id", getVolunteerById);

// UPDATE STATUS
router.put("/:id/status", updateVolunteerStatus);

// DELETE
router.delete("/:id", deleteVolunteer);

module.exports = router;
