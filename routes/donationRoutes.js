const express = require("express");
const router = express.Router();

const {
  createDonation,

  getDonations,
  getDonationById,
  updateDonationStatus,
  deleteDonation,
} = require("../controlers/donationController");

// Create donation
router.post("/", createDonation);

// Get all donations
router.get("/", getDonations);

// Get single donation
router.get("/:id", getDonationById);

// Update donation status
router.put("/:id", updateDonationStatus);

// Delete donation
router.delete("/:id", deleteDonation);

module.exports = router;
