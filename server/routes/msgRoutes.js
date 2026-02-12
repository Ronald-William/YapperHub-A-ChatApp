import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  sendMessage,
  getMessages
} from "../controllers/messageController.js";

const router = express.Router();

// GET /api/messages/:convoId - Get all messages in a conversation
router.get("/:convoId", protect, getMessages);

// POST /api/messages - Send a new message (expects conversationId in body)
router.post("/", protect, sendMessage);

export default router;