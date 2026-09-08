require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const app = express();

// Security & middleware
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || '*', credentials: true }));
app.use(express.json());
app.use(morgan('combined'));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 500 }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/teams', require('./middleware/auth'), require('./routes/teams'));
app.use('/api/attendance', require('./middleware/auth'), require('./routes/attendance'));
app.use('/api/finals', require('./middleware/auth'), require('./routes/finals'));

// Health check (no auth required)
app.get('/health', (_, res) => res.json({ status: 'ok', timestamp: new Date() }));

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected');
    const port = process.env.PORT || 5000;
    app.listen(port, () => console.log(`Server running on port ${port}`));
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
