const catchAsync = require("../utils/catchAsync");
const SavingGoal = require("../models/SavingGoal");
const { savingGoalSchema } = require("../validation/savingGoal.validation");
const { updateGoalSchema } = require("../validation/updateGoal.validation");
const { awardBadgeIfEligible } = require('../utils/badges');


exports.createSavingGoal = catchAsync(async (req, res, next) => {
  const { error } = savingGoalSchema.validate(req.body);
  if (error) throw { statusCode: 400, message: error.details[0].message };

  const exists = await SavingGoal.findOne({
    userId: req.id,
    title: req.body.title,
  });

  if (exists) {
    const errObj = new Error("You already have a goal with this title");
    errObj.statusCode = 400;
    throw errObj;
  }

  const goal = await SavingGoal.create({
    userId: req.id,
    title: req.body.title,
    targetAmount: req.body.targetAmount,
    currentAmount: req.body.currentAmount || 0,
    startDate: new Date(),
    deadline: req.body.deadline,
  });

  res.status(201).json({ success: true, data: goal });
});

exports.updateSavingGoal = catchAsync(async (req, res, next) => {
  const { error } = updateGoalSchema.validate(req.body);
  if (error) throw { statusCode: 400, message: error.details[0].message };

  const goal = await SavingGoal.findById(req.params.id);
  if (!goal) {
    throw { statusCode: 404, message: "Goal not found" };
  }
  if (goal.userId.toString() !== req.id.toString()) {
    throw { statusCode: 403, message: "Not allowed" };
  }
  

  goal.currentAmount = req.body.currentAmount;
  if (goal.currentAmount >= goal.targetAmount) {
    goal.status = "completed";
  }

  await goal.save();

  if (goal.status === "completed") {
    await awardBadgeIfEligible(req.id, "First Goal Achieved");
  }

  res.status(201).json({ success: true, data: goal });
});


exports.getMySavingGoals = catchAsync(async (req, res) => {
  const goals = await SavingGoal.find({ userId: req.id });
  res.json({
    success: true,
    data: goals
  });
});


exports.deleteSavingGoal = catchAsync(async (req, res) => {
  const goal = await SavingGoal.findById(req.params.id);
  if (!goal) throw { statusCode: 404, message: 'Goal not found' };
  if (goal.userId.toString() !== req.id.toString()) {
    throw { statusCode: 403, message: 'Not allowed' };
  }

  await goal.deleteOne();

  res.json({
    success: true,
    message: 'Goal deleted successfully'
  });
});
