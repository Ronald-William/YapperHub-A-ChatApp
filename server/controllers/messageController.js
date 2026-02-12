import Message from "../models/Message.js";
import Conversation from "../models/Conversation.js";
import User from "../models/User.js";
import { io } from "../server.js";

export const sendMessage = async (req, res) => {
  try {
    const { conversationId, text } = req.body;

    if (!conversationId || !text) {
      return res.status(400).json({ 
        message: "conversationId and text are required" 
      });
    }

    // Verify conversation exists and user is a participant
    const convo = await Conversation.findById(conversationId);
    
    if (!convo) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    // Check if user is a participant
    const isParticipant = convo.participants.some(
      p => p.toString() === req.user._id.toString()
    );

    if (!isParticipant) {
      return res.status(403).json({ 
        message: "You are not a participant in this conversation" 
      });
    }

    // Create the message
    const message = await Message.create({
      conversation: convo._id,
      sender: req.user._id,
      text
    });

    // Emit socket event to all participants
    io.to(convo._id.toString()).emit("newMessage", message);

    res.status(201).json(message);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ 
      message: "Server error",
      error: error.message 
    });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { convoId } = req.params;

    // Verify conversation exists and user is a participant
    const convo = await Conversation.findById(convoId);
    
    if (!convo) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    // Check if user is a participant
    const isParticipant = convo.participants.some(
      p => p.toString() === req.user._id.toString()
    );

    if (!isParticipant) {
      return res.status(403).json({ 
        message: "You are not a participant in this conversation" 
      });
    }

    const msgs = await Message.find({
      conversation: convoId
    })
    .populate("sender", "username name")
    .sort({ createdAt: 1 });

    res.json(msgs);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ 
      message: "Server error",
      error: error.message 
    });
  }
};