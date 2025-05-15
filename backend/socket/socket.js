import { Server } from 'socket.io';
import sharedSession from 'express-socket.io-session';

export const initSocket = (httpServer, sessionMiddleware) => {
  const io = new Server(httpServer, {
    cors: {
      origin: 'http://localhost:5173',
      credentials: true,
    },
  });

  // Share session with Socket.IO
  io.use(sharedSession(sessionMiddleware, {
    autoSave: true,
  }));

  io.on('connection', (socket) => {
    const userId = socket.handshake.auth?.userId || socket.handshake.session?.user?.id;
    console.log(`User connected: ${userId}`);

    // Dynamic room subscriptions
    socket.on('subscribe', (channel) => {
      socket.join(channel);
      console.log(`User ${userId} joined ${channel}`);
      // Get all rooms the user is currently in
      const rooms = Array.from(socket.rooms);  // socket.rooms contains the rooms the socket is in
    
      // Exclude the socket.id from the list, since each socket is in a room with its own ID
      const userRooms = rooms.filter(room => room !== socket.id);

      console.log(`User ${socket.id} is in rooms:`, userRooms);
    });

    socket.on('unsubscribe', (channel) => {
      socket.leave(channel);
      console.log(`User ${userId} left ${channel}`);
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${userId}`);
    });
  });

  return io;
};