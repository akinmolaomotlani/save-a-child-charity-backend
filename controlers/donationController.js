const axios = require("axios");
const Donation = require("../models/Donation");

const verifyPayment = async (req, res) => {
  try {
    const { reference, name, email, amount } = req.body;

    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      },
    );

    const paystackData = response.data.data;

    // Verify successful payment
    if (paystackData.status === "success") {
      // Prevent duplicate payment records
      const existingDonation = await Donation.findOne({ reference });

      if (existingDonation) {
        return res.json({
          status: true,
          message: "Donation already recorded",
        });
      }

      // Save donation
      const donation = await Donation.create({
        name,
        email,
        amount,
        reference,
        status: "success",
        paidAt: new Date(),
      });

      return res.json({
        status: true,
        message: "Donation successful",
        donation,
      });
    }

    return res.status(400).json({
      status: false,
      message: "Payment not successful",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      status: false,
      message: "Server error",
    });
  }
};

module.exports = {
  verifyPayment,
};
