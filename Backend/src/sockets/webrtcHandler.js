// backend/src/sockets/webrtcHandler.js

module.exports = (io, socket) => {
  socket.on('join_video_room', (roomId) => {
    socket.join(roomId);
    socket.to(roomId).emit('user_joined', socket.id);
    console.log(`User ${socket.id} joined video room ${roomId}`);
  });

  // Relay WebRTC signals (offer/answer/candidate) to peer in the room
  socket.on('webrtc_signal', (data) => {
    const { roomId, signalData } = data;
    // Broadcast the signal to the other person in the room
    socket.to(roomId).emit('webrtc_signal', signalData);
  });
  
  socket.on('leave_video_room', (roomId) => {
    socket.leave(roomId);
    socket.to(roomId).emit('user_left', socket.id);
  });

  // Notify a specific user of an incoming call
  socket.on('call_user', (data) => {
    const { targetUserId, roomId, callerName, callerImageUrl } = data;
    // targetUserId is their clerkId, which they use to join their personal room in chatHandler
    io.to(targetUserId).emit('incoming_call', {
      roomId,
      callerName,
      callerImageUrl
    });
  });
};
