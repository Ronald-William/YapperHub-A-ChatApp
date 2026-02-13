import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import authRoutes from "./routes/authRoutes.js"
import msgRoutes from "./routes/msgRoutes.js"
import conversationRoutes from "./routes/conversationRoutes.js";
import friendRoutes from "./routes/friendRoutes.js";
import friendRequestRoutes from "./routes/friendRequestRoutes.js"

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json());
app.use(cookieParser());
app.use("/api/conversations", conversationRoutes);
app.use("/api/friends", friendRoutes);
app.use("/api/users", authRoutes);
app.use("/api/messages", msgRoutes);
app.use("/api/friends", friendRequestRoutes)

export default app;