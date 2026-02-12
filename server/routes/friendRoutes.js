import express from "express";
import User from "../models/User.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/request/:username", protect, async (req, res) => {
  const target = await User.findOne({ username: req.params.username });

  if (!target) return res.status(404).json({ message: "User not found" });

  if (target.friendRequests.includes(req.user._id))
    return res.status(400).json({ message: "Already requested" });

  target.friendRequests.push(req.user._id);
  await target.save();

  res.json({ message: "Request sent" });
});

router.post("/accept/:id", protect, async (req, res) => {
  const senderId = req.params.id;

  if (!req.user.friendRequests.includes(senderId))
    return res.status(400).json({ message: "No request" });

  req.user.friendRequests = req.user.friendRequests.filter(
    (id) => id.toString() !== senderId
  );

  req.user.friends.push(senderId);

  const sender = await User.findById(senderId);
  sender.friends.push(req.user._id);

  await sender.save();
  await req.user.save();

  res.json({ message: "Friend added" });
});

router.get("/", protect, async (req, res) => {
  const user = await User.findById(req.user._id).populate(
    "friends",
    "username name"
  );

  res.json(user.friends);
});

router.get("/requests", protect, async (req, res) => {
  const user = await User.findById(req.user._id).populate(
    "friendRequests",
    "username name"
  );

  res.json(user.friendRequests);
});

export default router;
