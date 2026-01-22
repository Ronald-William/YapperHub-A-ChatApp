import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import authRoutes from "./routes/authRoutes.js"
import msgRoutes from "./routes/msgRoutes.js"

const app = express();

app.use(express.json());
//app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true
  })
);


app.use("/api/auth", authRoutes)

app.use("/api/messages", msgRoutes);


export default app;
