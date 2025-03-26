import mongoose from "mongoose";
import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import userAuth from "./routes/auth-route.js";
import uniqueNumber from "./routes/unique-number-route.js"
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
app.use(cors())
app.use(cookieParser())
app.use(express.json());
app.use(express.json({limit: "10mb"}))
app.use(express.urlencoded({limit: "10mb", extended: true}))

const PORT = 5000;
mongoose.connect(process.env.DB_URL).then(() => {
  app.listen(PORT, () => {
    console.log("connected to database");
  });
});

app.use("/api/auth", userAuth);
app.use("/api/unique-number", uniqueNumber);

app.use((err, res) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";
  return res.status(statusCode).json({ success: false, statusCode, message });
});
