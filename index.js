require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
// const passport = require('passport'); 
// require('./config/passport');
const userRoutes = require('./Routes/user');
const userSettingsRoutes = require('./Routes/userSettingsRoutes');
const chatRoute = require("./Routes/chatRoute");
const expenseRoute = require("./Routes/expenseRoute");
const savingGoalRoutes = require("./Routes/savingGoal");
const challengeRoutes = require("./Routes/challenge");
const badgeRoutes= require("./Routes/badge")

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log(' Connected to MongoDB'))
  .catch(err => console.error(' MongoDB connection error:', err));

const app = express();
// app.use(passport.initialize());
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use('/api/user', userRoutes);
app.use('/api/user/settings', userSettingsRoutes);
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ status: 'error', message: 'Something went wrong!' });
});

app.use("/api", chatRoute);
app.use("/api", expenseRoute); 
app.use("/api/saving-goals", savingGoalRoutes);
app.use("/api/challenges", challengeRoutes);
app.use("/api/badges", badgeRoutes);
const PORT = process.env.PORT || 3000;
app.listen(PORT, async() =>{
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  try {
    await require('./Controllers/chatController').initializeRAG();
  } catch (err) {
    console.warn("Failed to initialize RAG service:", err.message);
  }
});
