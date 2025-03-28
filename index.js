import mongoose from "mongoose";
import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import userAuthRoute from "./routes/auth-route.js";
import uniqueNumberRoute from "./routes/unique-number-route.js"
import candidateRoute from "./routes/candidate-route.js"
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

app.use(cookieParser())
app.use(express.json());
app.use(express.json({limit: "10mb"}))
app.use(express.urlencoded({limit: "10mb", extended: true}))
app.use(
  cors({
    origin: "http://localhost:3000", 
    credentials: true
  })
);
const PORT = 5000;
mongoose.connect(process.env.DB_URL).then(() => {
  app.listen(PORT, () => {
    console.log("connected to database");
  });
});

app.use("/api/auth", userAuthRoute);
app.use("/api/unique-number", uniqueNumberRoute);
app.use("/api/candidate", candidateRoute);

app.use((err, res) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";
  return res.status(statusCode).json({ success: false, statusCode, message });
});
