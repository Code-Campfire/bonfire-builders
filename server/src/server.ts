import dotenv from 'dotenv';
dotenv.config();
import app from './app';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import jwt from 'jsonwebtoken';

const server = createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Socket.io middleware for authentication
io.use(async (socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error('Authentication error'));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    socket.data.user = decoded;
    next();
  } catch (err) {
    next(new Error('Authentication error'));
  }
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.data.user.id);

  // Automatically join user's personal notification room
  socket.join(`user-${socket.data.user.id}`);

  // Join issue-specific room
  socket.on('join-issue', (issueId) => {
    socket.join(`issue-${issueId}`);
  });

  // Handle new messages
  socket.on('send-message', async (data) => {
    // Validate and save message
    // Emit to room
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.data.user.id);
  });
});

app.set('io', io);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
