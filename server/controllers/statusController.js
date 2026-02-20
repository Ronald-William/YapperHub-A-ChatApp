import redis from "../config/redis.js";

export const checkUserOnline = async(req,res)=>{
    try{
        const {userId} = req.params;
        const isOnline = await redis.exists(`online: ${userId}`);
        let lastSeen = null;
        if(!isOnline){
            lastSeen = await redis.get(`online ${userId}`);
        }
        res.json({
            userId,
            isOnline: isOnline===1,
            lastSeen: lastSeen ? parseInt(lastSeen): null
        });
    }
    catch(err){
        res.status(500).json({message: "Server error"});
    }
}

export const checkMultipleUsersOnline = async (req, res) => {
  try {
    const { userIds } = req.body;
    
    const statuses = await Promise.all(
      userIds.map(async (userId) => {
        const isOnline = await redis.exists(`online:${userId}`);
        return {
          userId,
          isOnline: isOnline === 1
        };
      })
    );

    res.json(statuses);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
