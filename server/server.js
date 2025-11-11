// Load correct environment file based on NODE_ENV
const envPath = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';
require('dotenv').config({ path: envPath });

// Dependencies
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// ✅ Initialize app FIRST
const app = express();
app.use(cors());
app.use(express.json());

// Routes
const bugRoutes = require('./routes/bugRoutes');
const postRoutes = require('./routes/posts');
app.use('/api/bugs', bugRoutes);
app.use('/api/posts', postRoutes);

// Error handler
const { errorHandler } = require('./middleware/errorHandler');
app.use(errorHandler);

// Connect to MongoDB and start server (only if not in test mode)
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    if (process.env.NODE_ENV !== 'test') {
      const port = process.env.PORT || 5000;
      app.listen(port, () => {
        console.log(`Server running on port ${port}`);
      });
    }
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Export app for Supertest
module.exports = app;
