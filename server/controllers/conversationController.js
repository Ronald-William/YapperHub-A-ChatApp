import Conversation from "../models/Conversation.js";
import User from "../models/User.js";

export const getMyConversations = async (req, res) => {
  try {
    const convos = await Conversation.find({
      participants: req.user._id
    }).populate("participants", "name username");

    // Transform to include 'friend' field for each conversation
    const transformedConvos = convos.map(convo => {
      const friend = convo.participants.find(
        p => p._id.toString() !== req.user._id.toString()
      );

      return {
        _id: convo._id,
        participants: convo.participants,
        friend: friend,
        updatedAt: convo.updatedAt,
      };
    });

    res.json({ data: transformedConvos });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
};

export const createConversation = async (req, res) => {
  try {
    const { friendUsername } = req.body;
    const currentUserId = req.user._id;

    // Validate input
    if (!friendUsername) {
      return res.status(400).json({ 
        message: 'Friend username is required' 
      });
    }

    // Find the friend by username
    const friend = await User.findOne({ 
      username: friendUsername.trim() 
    }).select('_id username name friends');

    if (!friend) {
      return res.status(404).json({ 
        message: 'User not found' 
      });
    }

    // Prevent adding yourself
    if (friend._id.toString() === currentUserId.toString()) {
      return res.status(400).json({ 
        message: 'You cannot add yourself as a friend' 
      });
    }

    // Add to friends list if not already friends
    const currentUser = await User.findById(currentUserId);
    
    if (!currentUser.friends.includes(friend._id)) {
      currentUser.friends.push(friend._id);
      await currentUser.save();
    }

    if (!friend.friends.includes(currentUserId)) {
      friend.friends.push(currentUserId);
      await friend.save();
    }

    // Check if conversation already exists
    const existingConvo = await Conversation.findOne({
      participants: { $all: [currentUserId, friend._id] }
    }).populate('participants', 'username name');

    if (existingConvo) {
      return res.status(200).json({ 
        message: 'Conversation already exists',
        _id: existingConvo._id,
        participants: existingConvo.participants,
        friend: friend
      });
    }

    // Create new conversation
    const newConversation = new Conversation({
      participants: [currentUserId, friend._id]
    });

    await newConversation.save();

    // Populate the conversation before sending
    const populatedConvo = await Conversation.findById(newConversation._id)
      .populate('participants', 'username name');

    res.status(201).json({ 
      message: 'Friend added successfully',
      _id: populatedConvo._id,
      participants: populatedConvo.participants,
      friend: friend
    });

  } catch (error) {
    console.error('Error creating conversation:', error);
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
};