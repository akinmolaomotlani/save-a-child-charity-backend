const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const connectDB = require("./config/db");
const stripeWebhook = require("./webhooks/stripeWebhook"); // ✅ FIXED
const messageRoutes = require("./routes/messageRoutes"); // ✅ FIXED
const userRoutes = require("./routes/userRoutes");
const app = express();

// ✅ Stripe webhook MUST come before express.json()
app.post("/webhook", express.raw({ type: "application/json" }), stripeWebhook);

// Security
app.use(helmet());

// CORS
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

// JSON parser
app.use(express.json());

// Rate limiter
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  }),
);

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/donations", require("./routes/donationRoutes"));
app.use("/api/volunteers", require("./routes/volunteerRoutes"));
app.use("/api/payments", require("./routes/paymentRoutes"));
app.use("/api/users", userRoutes);

// ✅ MESSAGE ROUTE
app.use("/api/messages", messageRoutes);

// Start server after DB connects
connectDB().then(() => {
  app.listen(5000, () => console.log("Server running on port 5000"));
});
