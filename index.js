require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport'); 
require('./config/passport');
const userRoutes = require('./Routes/user');

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log(' Connected to MongoDB'))
  .catch(err => console.error(' MongoDB connection error:', err));

const app = express();
app.use(passport.initialize());
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use('/api/user', userRoutes);
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ status: 'error', message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => 
  console.log(`🚀 Server running on http://localhost:${PORT}`));
