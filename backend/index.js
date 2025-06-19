const cors = require('cors');
const express = require('express');
const http = require('http');
const path = require('path');


const { Server } = require('socket.io');

////////////////// cors for web socket///////////////////////////////////////
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // 🔐 Replace with frontend URL in production
    methods: ["GET", "POST"]
  }
});


///////////////////////CORS for http request ///////////////////////////////////////////////

app.use(cors({ origin: 'http://localhost:3000' })); // or '*' for dev


// Setup Middleware
app.use(express.json());
//app.use('/uploads', express.static('uploads'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Routes
const messageRoutes = require('./routes/messages');
const listingRoutes = require('./routes/listing');
const calendarRoutes = require('./routes/calendar'); // 📁 We'll extract this
app.use('/api/messages', messageRoutes);
app.use('/api/listing', listingRoutes);
app.use('/api/calendar', calendarRoutes);


const adminRoutes = require('./routes/adminRoutes');


//  other routes
app.use('/api/admin', adminRoutes);




//////////////////////////Kim's Routes //////////////////////////////
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const errorHandling = require("./middleware/errorHandler");
const rentalAppRoutes = require("./routes/rentalAppRoutes");
// const verifRoutes = require("./routes/verifRoutes");

app.use(errorHandling);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/rentals", rentalAppRoutes);
// app.use("/api/verif", verifRoutes);v


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
server.listen(5000, () => {
  console.log("🚀 Server + WebSocket running on port 5000");
});
