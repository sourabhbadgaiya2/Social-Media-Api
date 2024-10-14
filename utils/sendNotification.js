const redisClient = require("../config/redisclient");
// const io = require("../socketio");

// const sendNotification = async (receiverId, message) => {
//   // Store notification in Redis
//   redisClient.lpush(`notifications:${receiverId}`, message);

//   // Emit notification via Socket.io
//   io.to(receiverId).emit("notification", message);
// };

// module.exports = { sendNotification };

const { getSocketInstance } = require("../socketio"); // Adjust path as necessary

const sendNotification = (receiverId, message) => {
  // Store notification in Redis
  redisClient.lpush(`notifications:${receiverId}`, message);

  const io = getSocketInstance(); // Get the Socket.io instance
  io.to(receiverId).emit("notification", message);
};

module.exports = sendNotification;
