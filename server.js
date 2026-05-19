const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const http = require("http"); // ✅ NEW
const { Server } = require("socket.io"); // ✅ NEW

const connectDB = require("./config/db");
const messageRoutes = require("./routes/messageRoutes");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

// ✅ CREATE HTTP SERVER (IMPORTANT)
const server = http.createServer(app);

// ✅ SOCKET.IO SETUP
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://save-a-child-charity-frontend.vercel.app",
    ],
    credentials: true,
  },
});

app.set("trust", 1);

// ✅ SOCKET CONNECTION
io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  // join user room
  socket.on("join", (userId) => {
    socket.join(userId);
    console.log("📥 Joined room:", userId);
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});

// ✅ MAKE IO AVAILABLE IN ROUTES
app.set("io", io);

// Security
app.use(helmet());

// CORS
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://save-a-child-charity-frontend-6vx7.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
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
app.use("/api/auth", authRoutes);
app.use("/api/donations", require("./routes/donationRoutes"));
app.use("/api/volunteers", require("./routes/volunteerRoutes"));
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);

// ✅ START SERVER (IMPORTANT: use server.listen NOT app.listen)
connectDB().then(() => {
  server.listen(5000, () => console.log("🚀 Server running on port 5000"));
});
