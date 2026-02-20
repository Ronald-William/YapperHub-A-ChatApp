import jwt from 'jsonwebtoken';
import User from "../models/User.js";
import redis from "../config/redis.js";

export const protect = async (req, res, next) => {
  const token = req.cookies.token;
  
  if (!token) {
    return res.status(401).json({ message: "Not authorized - no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const cachedUser = await redis.get(`user:${userId}`);
    
    if (cachedUser) {
      req.user = JSON.parse(cachedUser);
      console.log('✓ Cache hit for user:', userId);
    } else {
      console.log('✗ Cache miss for user:', userId);
      const user = await User.findById(userId).select("-password");
      
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      
      const userObject = {
        _id: user._id.toString(),
        username: user.username,
        email: user.email,
        name: user.name,
        friends: user.friends,
        friendRequests: user.friendRequests
      };

     
      await redis.setex(
        `user:${userId}`,
        3600,
        JSON.stringify(userObject)
      );

      req.user = userObject;
    }

    next();
  } catch (err) {
    console.error('Auth error:', err.message);
    
    
    if (err.name === 'TokenExpiredError') {
      await redis.del(`user:${decoded?.id}`);
    }
    
    res.status(401).json({ message: "Token failed" });
  }
};