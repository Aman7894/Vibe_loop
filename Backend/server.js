const http = require('http');
const app = require('./src/app');
const connectDB = require('./src/db/db');
require('dotenv').config();

const port = process.env.PORT || 3000;

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
const { Server } = require('socket.io');
const io = new Server(server, {
  cors: {
    origin: '*', // Set to your frontend domain in production
    methods: ['GET', 'POST']
  }
});

// Expose io to the Express application routes
app.set('io', io);

// Import socket handlers
const chatHandler = require('./src/sockets/chatHandler');
const webrtcHandler = require('./src/sockets/webrtcHandler');

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);
  
  // Register handlers
  chatHandler(io, socket);
  webrtcHandler(io, socket);
  
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

connectDB()
.then(() => {
    server.listen(port, () => {
        console.log(`server is running on port ${port}`);
    });
})
.catch((err) => {
    console.error("MongoDB connection failed:", err);
});