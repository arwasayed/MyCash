const catchAsync = require("../utils/catchAsync");
const SavingGoal = require("../models/SavingGoal");
const { savingGoalSchema } = require("../validation/savingGoal.validation");
const { updateGoalSchema } = require("../validation/updateGoal.validation");
const { awardBadgeIfEligible } = require('../utils/badges');
const { getBalance } = require("../Controllers/expenseController");

exports.createSavingGoal = catchAsync(async (req, res, next) => {
  const { error } = savingGoalSchema.validate(req.body);
  if (error) throw { statusCode: 400, message: error.details[0].message };

  const exists = await SavingGoal.findOne({
    userId: req.user._id,
    title: req.body.title,
  });

  if (exists) {
    const errObj = new Error("الهدف موجود شوف غيره.");
    errObj.statusCode = 400;
    throw errObj;
  }

  const goal = await SavingGoal.create({
    userId: req.user._id,
    title: req.body.title,
    targetAmount: req.body.targetAmount,
    currentAmount: req.body.currentAmount || 0,
    startDate: new Date(),
    deadline: req.body.deadline,
  });

  res.status(201).json({ success: true, data: goal });
});

const Income = require("../models/Income");
const Expense = require('../models/Expense');
const { calculateNewBalance, getCurrentBalance } = require('../services/financeService'); 
const { v4: uuidv4 } = require("uuid");

exports.updateSavingGoal = catchAsync(async (req, res, next) => {
  const { error } = updateGoalSchema.validate(req.body);
  if (error) throw { statusCode: 400, message: error.details[0].message };

  const goal = await SavingGoal.findById(req.params.id);
  if (!goal) throw { statusCode: 404, message: "Goal not found" };
 
  const prevAmount = goal.currentAmount;
  const newAmount = req.body.currentAmount;
  const addedAmount = newAmount - prevAmount;
  const userId = req.user._id.toString()
  
  if (addedAmount > 0) {
    const balanceInfo = await calculateNewBalance(userId, addedAmount, false);
    if (balanceInfo.current_balance < addedAmount) {
      return res.status(400).json({
        error: `رصيدك الحالي ${balanceInfo.current_balance} ${balanceInfo.currency} غير كافي لهذا التحديث`,
      });
    }
    
    await Expense.create({
      id: uuidv4(),
      user_id: userId,
      amount: addedAmount,
      balance_after: balanceInfo.current_balance - addedAmount ,
      category: 'Saving',
      description: `Saving towards goal: ${goal._id}`,
      date: new Date()
    });
  }else{
    const amount = prevAmount-newAmount;
    const balanceInfo = await calculateNewBalance(userId, amount, true);
        
        const income = await Income.create({
          id: uuidv4(),
          user_id: userId,
          amount,
          description: "From Goals",
          balance_after: balanceInfo.new_balance,
        });

        const existingExpense = await Expense.findOne({
          user_id: userId,
          category: "Saving",
          description: `Saving towards goal: ${goal._id}`,
          amount: { $gte: amount },
        });      
        
        if (existingExpense) {
          existingExpense.amount -= amount;
          existingExpense.updated_at = new Date();
          await existingExpense.save();
        }
  }

  goal.currentAmount = newAmount;
  if (newAmount >= goal.targetAmount) {
    goal.status = "completed";
  }

  await goal.save();

  if (goal.status === "completed") {
    await awardBadgeIfEligible(req.user._id, goal.title, 'goal');
  }

  res.status(200).json({ success: true, data: goal });
});



exports.getMySavingGoals = catchAsync(async (req, res) => {
  const goals = await SavingGoal.find({ userId: req.user._id });
  res.json({
    success: true,
    data: goals
  });
});


exports.deleteSavingGoal = catchAsync(async (req, res) => {
  const goal = await SavingGoal.findById(req.params.id);
  if (!goal) throw { statusCode: 404, message: 'Goal not found' };
  if (goal.userId.toString() !== req.user._id.toString()) {
    throw { statusCode: 403, message: 'Not allowed' };
  }

  await goal.deleteOne();

  res.json({
    success: true,
    message: 'Goal deleted successfully'
  });
});