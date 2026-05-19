const axios = require("axios");
const Donation = require("../models/Donation");

const verifyPayment = async (req, res) => {
  try {
    console.log("BODY:", req.body);

    const { reference, name, email, amount } = req.body;

    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      },
    );

    console.log("PAYSTACK RESPONSE:", response.data);

    const paystackData = response.data.data;

    if (paystackData.status === "success") {
      const existingDonation = await Donation.findOne({ reference });

      console.log("EXISTING:", existingDonation);

      if (existingDonation) {
        return res.json({
          status: true,
          message: "Donation already recorded",
        });
      }

      const donation = await Donation.create({
        name,
        email,
        amount,
        reference,
        status: "success",
        paidAt: new Date(),
      });

      console.log("DONATION SAVED:", donation);

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
    console.log("VERIFY ERROR:", error.response?.data || error.message);

    res.status(500).json({
      status: false,
      message: "Server error",
    });
  }
};

module.exports = {
  verifyPayment,
};
