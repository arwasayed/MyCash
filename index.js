require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport'); 
require('./config/passport');
const userRoutes = require('./Routes/user');
<<<<<<< HEAD
const userSettingsRoutes = require('./routes/userSettingsRoutes');
=======
>>>>>>> 76cede1ffaf8fb12bea9f3ebdaa4e7977f1b6383

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log(' Connected to MongoDB'))
  .catch(err => console.error(' MongoDB connection error:', err));

const app = express();
app.use(passport.initialize());
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use('/api/user', userRoutes);
<<<<<<< HEAD
app.use('/api/user/settings', userSettingsRoutes);
=======
>>>>>>> 76cede1ffaf8fb12bea9f3ebdaa4e7977f1b6383
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ status: 'error', message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => 
  console.log(`🚀 Server running on http://localhost:${PORT}`));
