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

const users = new Map();     // userId -> socketId
const sockets = new Map();   // socketId -> userId


io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join", (userId) => {
    users.set(userId, socket.id);
    sockets.set(socket.id, userId);
  });


  socket.on("disconnect", () => {
    const userId = sockets.get(socket.id);

    if (userId) {
      users.delete(userId);
      sockets.delete(socket.id);
      console.log("deleted:", userId);
    }
  });

});

export const getSocketId = (userId) => users.get(userId);

const startServer = async () => {
  await connectDB();

  myServer.listen(process.env.PORT || 5000, () => {
    console.log("Server running with socket");
  });
};

startServer();
