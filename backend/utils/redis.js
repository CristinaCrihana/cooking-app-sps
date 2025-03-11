const { createClient } = require('redis');

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', err => console.error('Redis Client Error:', err));

// Connect to Redis when the file is imported
(async () => {
  await redisClient.connect();
})();

module.exports = redisClient; 