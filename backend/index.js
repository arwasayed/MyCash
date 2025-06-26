const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const savingGoalRoutes = require("./routes/savingGoal");
const challengeRoutes = require("./routes/challenge");
const badgeRoutes= require("./routes/badge")
const AppError = require("./utils/AppError");
const { errorHandler } = require("./middlewares/errorHandler");

mongoose .connect( "mongodb+srv://nadasalahit:E1ylkLJ2DxVryXev@cluster0.qsj8rs6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => console.log("Successfully connected to database"))
  .catch((err) => console.error("Error connecting to database:", err.message));

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));

app.set("view engine", "pug");
app.set("views", "./views");


app.use("/saving-goals", savingGoalRoutes);
app.use("/challenges", challengeRoutes);
app.use("/badges", badgeRoutes);


app.use((req, res, next) => {
  next(new AppError(404, `Can not find ${req.originalUrl} on this server`));
});


app.use(errorHandler);

const port = 3000;
app.listen(port, () => {
  console.log(`Server started successfully on port ${port}`);
});
