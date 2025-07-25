import mongoose from "mongoose";
import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import adminRoute from "./routes/auth-route.js";
// import uniqueNumberRoute from "./routes/unique-number-route.js";
import candidateRoute from "./routes/candidate-route.js";
import studentRoute from "./routes/student-route.js";
import voteRoute from "./routes/cast-vote-route.js";
import cookieParser from "cookie-parser";
dotenv.config();
const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use("/uploads", express.static("uploads"));

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://e-voting-admin.vercel.app",
  "https://e-voting-client-zeta.vercel.app",
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

const PORT = 5000;
mongoose.connect(process.env.DB_URL).then(() => {
  app.listen(PORT, () => {
    console.log("connected to database");
  });
});
app.use("/api/admin-auth", adminRoute);
app.use("/api/student-auth", studentRoute);
// app.use("/api/unique-number", uniqueNumberRoute);
app.use("/api/candidate", candidateRoute);
app.use("/api/vote", voteRoute);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";
  return res.status(statusCode).json({ success: false, statusCode, message });
});
