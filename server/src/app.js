const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const healthRouter = require('./routes/health');
const userRouter = require('./routes/users');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/health', healthRouter);
app.use('/users', userRouter);

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Apartment Maintenance Tracker API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

module.exports = app;
