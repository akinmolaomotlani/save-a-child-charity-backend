const Donation = require("../models/donation.js");

// ===============================
// CREATE DONATION
// ===============================
exports.createDonation = async (req, res) => {
  try {
    const { amount, donorName, donorEmail } = req.body;

    // ✅ Validation
    if (!amount || !donorName || !donorEmail) {
      return res.status(400).json({
        success: false,
        message: "Amount, donor name, and email are required",
      });
    }

    // ✅ Create donation (no payment logic)
    const donation = await Donation.create({
      donorName,
      donorEmail,
      amount,
      status: "pending",
    });

    res.status(201).json({
      success: true,
      message: "Donation created successfully",
      data: donation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating donation",
      error: error.message,
    });
  }
};

// ===============================
// GET ALL DONATIONS
// ===============================
exports.getDonations = async (req, res) => {
  try {
    const donations = await Donation.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: donations.length,
      data: donations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching donations",
      error: error.message,
    });
  }
};

// ===============================
// GET SINGLE DONATION
// ===============================
exports.getDonationById = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: "Donation not found",
      });
    }

    res.status(200).json({
      success: true,
      data: donation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Invalid ID or server error",
      error: error.message,
    });
  }
};

// ===============================
// UPDATE DONATION STATUS
// ===============================
exports.updateDonationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // ✅ Validation
    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    const donation = await Donation.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    );

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: "Donation not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Donation updated successfully",
      data: donation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating donation",
      error: error.message,
    });
  }
};

// ===============================
// DELETE DONATION
// ===============================
exports.deleteDonation = async (req, res) => {
  try {
    const donation = await Donation.findByIdAndDelete(req.params.id);

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: "Donation not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Donation deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting donation",
      error: error.message,
    });
  }
};
