import User from "../models/User.js";
import jwt from "jsonwebtoken";
import redis from "../config/redis.js"
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};



export const registerUser = async (req, res) => {
  const { name, username, email, password } = req.body;

  const userExists = await User.findOne({
    $or: [{ email }, { username }]
  });

  if (userExists)
    return res.status(400).json({ message: "User already exists" });

  const user = await User.create({
    name,
    username,
    email,
    password
  });

  const token = generateToken(user._id);

  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax"
  });

  res.status(201).json({
    _id: user._id,
    name: user.name,
    username: user.username,
    email: user.email
  });
};



export const loginUser = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    const user = await User.findOne({
      $or: [
        { email: identifier },
        { username: identifier }
      ]
    });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id);
    await redis.setex(
      `user: ${user._id}`,
      3600,
      JSON.stringify({
        _id: user._id,
        username: user.username,
        email: user.email,
        name: user.name,
        friends: user.friends
      })
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax"
    });

    res.status(200).json({
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email
    });
  }
  catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};




export const logoutUser = async (req, res) => {
  try {
    if (req.user && req.user._id) {
      await redis.del(`user: ${req.user._id}`);
      console.log("cleared cache for user: ", req.user_id);
    }
    res.clearCookie("token");
    res.json({ message: "Logged Out!" });
  }
  catch (err) {
    console.error('Logout error:', error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMe = async (req, res) => {
  res.json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    username: req.user.username
  });
};
