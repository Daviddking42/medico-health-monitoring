const express = require('express');
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');
const config = require('./config/env');
const prisma = require('./config/prisma');

// Import routes
const authRoutes = require('./routes/authRoutes');
const patientRoutes = require('./routes/patientRoutes');
const deviceRoutes = require('./routes/deviceRoutes');
const alertRoutes = require('./routes/alertRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const relativeRoutes = require('./routes/relativeRoutes');
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: config.CORS_ORIGIN.split(','),
    methods: ['GET', 'POST']
  }
});

// Prisma is already initialized in config/prisma

// Make io global for use in controllers
global.io = io;

// Middleware
app.use(express.json());
app.use(cors({ origin: config.CORS_ORIGIN.split(',') }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/patient', patientRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/doctor', doctorRoutes);
app.use('/api/relative', relativeRoutes);
// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// WebSocket events
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('join-patient', (patientId) => {
    socket.join(`patient-${patientId}`);
    console.log(`Socket ${socket.id} joined patient-${patientId}`);
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
const PORT = config.PORT;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${config.NODE_ENV}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down...');
  await prisma.$disconnect();
  process.exit(0);
});
