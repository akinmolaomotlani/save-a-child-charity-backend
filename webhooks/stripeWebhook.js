console.log("🔥 Webhook received!");
const express = require("express");
const router = express.Router();
const stripe = require("../config/stripe");
const Donation = require("../models/donation");

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET,
      );
    } catch (err) {
      console.log("Webhook Error:", err.message);
      return res.sendStatus(400);
    }

    // ✅ SUCCESS
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;

      await Donation.findOneAndUpdate(
        { paymentIntentId: paymentIntent.id },
        { status: "succeeded" },
      );

      console.log("✅ Payment updated");
    }

    // ❌ FAILED
    if (event.type === "payment_intent.payment_failed") {
      const paymentIntent = event.data.object;

      await Donation.findOneAndUpdate(
        { paymentIntentId: paymentIntent.id },
        { status: "failed" },
      );
    }

    res.sendStatus(200);
  },
);

module.exports = router;
