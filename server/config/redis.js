import Redis from "ioredis";

const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    retryStrategy: (times)=>{
        const delay = Math.min(times*50, 2000);
        return delay;
    }
});

redis.on('connect', () =>{
    console.log("redis connected");
})
redis.on('error',(err)=>{
    console.log('Redis error: ',err);
})


export const clearUserCache = async (userId) => {
  try {
    await redis.del(`user:${userId}`);
    console.log('Cleared cache for user:', userId);
  } catch (err) {
    console.error('Cache clear failed:', err);
  }
};

export default redis;