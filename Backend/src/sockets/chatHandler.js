// backend/src/sockets/chatHandler.js
const Message = require('../models/message.model'); 
const User = require('../models/user.model');
const Conversation = require('../models/conversation.model');

module.exports = (io, socket) => {
  // Join a personal room uniquely identified by the user's clerkID
  socket.on('join_chat', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their personal room`);
  });

  socket.on('send_message', async (data) => {
    const { senderId, targetUserId, content, tempId } = data; // senderId and targetUserId are Clerk IDs
    
    try {
      // 1. Resolve MongoDB Document IDs from Clerk String IDs
      const senderUser = await User.findOne({ clerkId: senderId });
      const targetUser = await User.findOne({ clerkId: targetUserId });

      if (!senderUser || !targetUser) {
        return socket.emit('message_error', { error: 'Users not found', tempId });
      }

      // 2. Find or Create conversation automatically
      let conversation = await Conversation.findOne({
        participants: { $all: [senderUser._id, targetUser._id] }
      });

      if (!conversation) {
        conversation = await Conversation.create({
          participants: [senderUser._id, targetUser._id]
        });
      }

      // 3. Save message to MongoDB using mapped ObjectIds
      const newMessage = await Message.create({
        conversation: conversation._id,
        sender: senderUser._id,
        content: content,
        isRead: false
      });

      // 4. Populate Sender to send back properly to UI
      const populatedMessage = await Message.findById(newMessage._id).populate('sender', 'username imageUrl clerkId');

      // 4.5 Create Notification for Message
      const Notification = require('../models/notification.model');
      const notification = await Notification.create({
        recipient: targetUser._id,
        sender: senderUser._id,
        type: 'message',
        text: `${senderUser.username} sent you a message.`
      });
      // Hydrate via populate
      const populatedNotification = await Notification.findById(notification._id).populate('sender', 'username imageUrl clerkId');

      // 5. Deliver to target user in real-time using their clerkId (Socket room string)
      io.to(targetUserId).emit('receive_message', {
        ...populatedMessage.toObject(),
        tempId: tempId 
      });
      io.to(targetUserId).emit('receive_notification', populatedNotification);
      
      // 6. Send confirmation back to sender
      socket.emit('message_sent', {
        ...populatedMessage.toObject(),
        tempId: tempId
      });
      
    } catch (err) {
      console.error('Error sending message:', err);
      socket.emit('message_error', { error: 'Failed to send message', tempId: data.tempId });
    }
  });

  socket.on('typing', (data) => {
    const { targetUserId, isTyping } = data;
    io.to(targetUserId).emit('typing_status', { userId: socket.id, isTyping });
  });
};

