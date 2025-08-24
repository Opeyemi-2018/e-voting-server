import mongoose from "mongoose";
import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import adminRoute from "./routes/auth-route.js";
import candidateRoute from "./routes/candidate-route.js";
import studentRoute from "./routes/student-route.js";
import voteRoute from "./routes/cast-vote-route.js";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();

// Middleware
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// CORS
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  process.env.CLIENT_URL,
  process.env.ADMIN_URL, 
];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Routes
app.use("/api/admin-auth", adminRoute);
app.use("/api/student-auth", studentRoute);
app.use("/api/candidate", candidateRoute);
app.use("/api/vote", voteRoute);

// Error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";
  return res.status(statusCode).json({ success: false, statusCode, message });
});

// Start server
const PORT = 5000;
mongoose.connect(process.env.DB_URL).then(() => {
  app.listen(PORT, () => {
    console.log("Connected to database on port", PORT);
  });
});
