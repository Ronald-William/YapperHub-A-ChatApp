import User from "../models/User.js";
import jwt from "jsonwebtoken";

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
};




export const logoutUser = async (req, res) => {
  res.cookie("token", "", { expires: new Date(0) });
  res.json({ message: "Logged out" });
};
export const getMe = async (req, res) => {
  res.json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    username: req.user.username
  });
};
