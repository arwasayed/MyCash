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
const badgeRoutes= require("./Routes/badge");
const subscriptionRoutes = require("./Routes/subscription");
const notificationRoutes= require("./Routes/notification");
const path = require('path');
const { dailyFinanceCheck } = require('./services/scheduler');

const paymentRoutes = require('./Routes/paymentRoute');
//Hager
const uploadRouter = require('./Routes/upload');
const dailyTasksRoutes = require('./Routes/dailyTasks');




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

//Hager
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api', uploadRouter);

app.use("/api", chatRoute);
app.use("/api", expenseRoute); 
app.use("/api", paymentRoutes);

app.use("/api/saving-goals", savingGoalRoutes);
app.use("/api/challenges", challengeRoutes);
app.use("/api/badges", badgeRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/notifications", notificationRoutes);
app.use('/api/daily-tasks', dailyTasksRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, async() =>{
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  try {
    await require('./Controllers/chatController').initializeRAG();
  } catch (err) {
    console.warn("Failed to initialize RAG service:", err.message);
  }
   setInterval(dailyFinanceCheck, 24 * 60 * 60 * 1000);
});
