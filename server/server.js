import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import connectDB from "./config/db.js";
import http from "http";
import { Server } from "socket.io";
import redis from "./config/redis.js"

const myServer = http.createServer(app);

export const io = new Server(myServer, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true
  }
});

io.on("connection", (socket) => {
  console.log("connected:", socket.id);
  let currentUserId = null;
  socket.on("joinUser", async(userId) => {
    console.log(`User ${userId} joined their personal room`);
    socket.join(userId);
    currentUserId = userId;

    await redis.setex(`online: ${userId} joined`,300,Date.now().toString());
    io.emit("userOnline",userId);
  });

  socket.on("joinConversation", (convoId) => {
    console.log(`Socket ${socket.id} joined conversation: ${convoId}`);
    socket.join(convoId);
  });

  socket.on("leaveConversation", (convoId) => {
    console.log(`Socket ${socket.id} left conversation: ${convoId}`);
    socket.leave(convoId);

  });
  
  socket.on("heartbeat",async(userId)=>{
    await redis.setex(`online: ${userId}`,300,Date.now().toString());
  })

  socket.on("disconnect", async() => {
    
    console.log("disconnected:", socket.id);

    if(currentUserId){
      await redis.del(`online: ${currentUserId}`);
      io.emit("userOffline",currentUserId);
    }
  });
});

const start = async () => {
  await connectDB();

  myServer.listen(process.env.PORT || 5000, () => {
    console.log("server running");
  });
};

start();