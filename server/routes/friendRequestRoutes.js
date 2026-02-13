import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  sendFriendRequest,
  getFriendRequests,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriends,
  removeFriend
} from "../controllers/friendRequestController.js";

const router = express.Router();

// Get all friends
router.get("/", protect, getFriends);

// Send friend request
router.post("/request", protect, sendFriendRequest);

// Get incoming friend requests
router.get("/requests", protect, getFriendRequests);

// Accept friend request
router.post("/accept/:requesterId", protect, acceptFriendRequest);

// Reject friend request
router.post("/reject/:requesterId", protect, rejectFriendRequest);

// Remove friend
router.delete("/:friendId", protect, removeFriend);

export default router;