const express = require('express');
const http = require('http');
const { Server } = require('socket.io');


const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // 🔐 Replace with frontend URL in production
    methods: ["GET", "POST"]
  }
});

// Setup Middleware
app.use(express.json());
app.use('/uploads', express.static('uploads'));


// Routes
const messageRoutes = require('./routes/messages');
const listingRoutes = require('./routes/listing');
const calendarRoutes = require('./routes/calendar'); // 📁 We'll extract this
app.use('/api/messages', messageRoutes);
app.use('/api/listing', listingRoutes);
app.use('/api/calendar', calendarRoutes);

// WebSocket setup
const { setSocketInstance } = require('./controllers/messageController');
setSocketInstance(io);

io.on("connection", (socket) => {
  console.log("🔌 User connected:", socket.id);

  socket.on("joinRoom", (conversationId) => {
    socket.join(conversationId);
    console.log(`📥 Joined room: ${conversationId}`);
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

// Start server
server.listen(3000, () => {
  console.log("🚀 Server + WebSocket running on port 3000");
});
