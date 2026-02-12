import User from "../models/User.js";

export const addFriend = async (req, res) => {
  const { username } = req.body;

  const friend = await User.findOne({ username });
  if (!friend) return res.status(404).json({ message: "User not found" });

  const user = await User.findById(req.user._id);

  if (!user.friends.includes(friend._id)) {
    user.friends.push(friend._id);
    await user.save();
  }

  res.json({ message: "Friend added" });
};

export const getFriends = async (req, res) => {
  const user = await User.findById(req.user._id).populate(
    "friends",
    "username name"
  );

  res.json(user.friends);
};
