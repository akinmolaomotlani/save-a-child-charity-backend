const express = require("express");
const router = express.Router();

const { verifyPayment } = require("../controlers/donationController");

router.post("/donations", verifyPayment);

module.exports = router;
