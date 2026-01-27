import express from 'express';
import Message from '../models/Message.js';
import {protect} from "../middleware/authMiddleware.js"
const router = express.Router();
router.post("/", protect, async (req, res) => {
    const { receiver, text } = req.body;

    const msg = await Message.create({
        sender: req.user._id,
        receiver,
        text
    });

    res.json(msg);
});

router.get("/:userId", protect, async(req,res)=>{
    const messages = await Message.find({
        $or: [
            {sender: req.user._id, receiver: req.params.userId},
            {sender: req.params.userId, receiver: req.user._id}
        ]
    }).sort({createdAt: 1});
    res.json(messages);
})

export default router;