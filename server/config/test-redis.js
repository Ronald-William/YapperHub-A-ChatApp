import redis from './redis.js';

async function testRedis() {
  try {
    await redis.set('test', 'Hello Redis!');
    const value = await redis.get('test');
    console.log('✓ Redis working! Value:', value);
    
    await redis.setex('temp', 5, 'expires in 5 seconds');
    console.log('✓ TTL set successfully');
    
    await redis.del('test', 'temp');
    console.log('✓ Redis test complete');
    
  } catch (err) {
    console.error('✗ Redis test failed:', err);
  }
}

testRedis();