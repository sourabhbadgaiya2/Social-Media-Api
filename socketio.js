const http = require('http');
const socketio = require('socket.io');

let io; // Declare io variable

const initSocket = (server) => {
  io = socketio(server);

  io.on('connection', (socket) => {
    console.log('New WebSocket connection...');

    socket.on('join', (userId) => {
      socket.join(userId); // Join the room based on user ID
    });
  });
};

const getSocketInstance = () => {
  if (!io) {
    throw new Error('Socket.io not initialized. Make sure to call initSocket first.');
  }
  return io;
};

module.exports = { initSocket, getSocketInstance };
