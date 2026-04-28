const stripe = require("../config/stripe");
const Donation = require("../models/donation");

exports.createPaymentIntent = async (req, res) => {
  try {
    const { amount, donorName, email } = req.body;

    if (!amount || !donorName || !email) {
      return res.status(400).json({ message: "All fields required" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: "usd",
      receipt_email: email,
      metadata: {
        donorName,
        email,
      },
    });

    const donation = await Donation.create({
      donorName,
      email,
      amount,
      paymentIntentId: paymentIntent.id,
      status: "pending",
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      donationId: donation._id,
    });
  } catch (error) {
    console.error("CREATE INTENT ERROR:", error.message);
    res.status(500).json({ message: "Payment failed" });
  }
};
