import express from "express";
import Message from "../models/Message.js";
import User from "../models/User.js";
import { protect } from "../middleware/authMiddleware.js";
import { getSocketId, io } from "../server.js";

const router = express.Router();

router.post("/", protect, async (req, res) => {
  const { receiverUsername, text } = req.body;

  const receiver = await User.findOne({ username: receiverUsername });

  if (!receiver) {
    return res.status(404).json({ message: "User not found" });
  }

  const message = await Message.create({
    sender: req.user._id,
    receiver: receiver._id,
    text
  });

  const receiverSocketId = getSocketId(receiver._id.toString());

  if (receiverSocketId) {
    // Convert to plain object and ensure sender field is properly set
    const messageToSend = {
      _id: message._id,
      sender: message.sender,
      receiver: message.receiver,
      text: message.text,
      createdAt: message.createdAt
    };
    io.to(receiverSocketId).emit("newMessage", messageToSend);
  }

  res.status(201).json(message);
});

router.get("/:username", protect, async (req, res) => {
  const other = await User.findOne({ username: req.params.username });

  if (!other) {
    return res.status(404).json({ message: "User not found" });
  }

  const msgs = await Message.find({
    $or: [
      { sender: req.user._id, receiver: other._id },
      { sender: other._id, receiver: req.user._id }
    ]
  }).sort({ createdAt: 1 });

  res.json(msgs);
});

export default router;