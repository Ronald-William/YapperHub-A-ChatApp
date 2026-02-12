import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getMyConversations, createConversation } from "../controllers/conversationController.js";

const router = express.Router();

router.get("/", protect, getMyConversations);
router.post("/", protect, createConversation);

export default router;