// redis
const Redis = require("ioredis");

const redisClient = new Redis({
  host: "redis-12477.c305.ap-south-1-1.ec2.redns.redis-cloud.com",
  port: 12477,
  password: "o0kzoFP0SKK22lFF4xFLEFVaVeTAqjix",
});

redisClient.on("connect", () => {
  console.log("Connected to Redis...");
});

redisClient.on("error", (err) => {
  console.error("Redis error:", err);
});

module.exports = redisClient;
