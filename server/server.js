import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import connectDB from "./config/db.js";
import http from "http";
import { Server } from "socket.io";

const myServer = http.createServer(app);

export const io = new Server(myServer, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true
  }
});

io.on("connection", (socket) => {
  console.log("connected:", socket.id);

  socket.on("joinUser", (userId) => {
    console.log(`User ${userId} joined their personal room`);
    socket.join(userId);
  });

  socket.on("joinConversation", (convoId) => {
    console.log(`Socket ${socket.id} joined conversation: ${convoId}`);
    socket.join(convoId);
  });

  socket.on("leaveConversation", (convoId) => {
    console.log(`Socket ${socket.id} left conversation: ${convoId}`);
    socket.leave(convoId);
  });

  socket.on("disconnect", () => {
    console.log("disconnected:", socket.id);
  });
});

const start = async () => {
  await connectDB();

  myServer.listen(process.env.PORT || 5000, () => {
    console.log("server running");
  });
};

start();