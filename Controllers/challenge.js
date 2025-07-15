const catchAsync = require("../utils/catchAsync");
const { awardBadgeIfEligible } = require("../utils/badges");
const SavingGoal = require("../models/SavingGoal");
const UserChallenge = require("../models/UserChallenge");
const Challenge = require("../models/Challenge");
const { challengeSchema } = require('../validation/challenge.validation');
const cron = require("node-cron");
const { createNotification } = require("../Controllers/notification");
const User = require("../models/userModel");
const Badge = require('../models/Badge');

exports.joinChallenge = catchAsync(async (req, res) => {
  const exists = await UserChallenge.findOne({
    userId: req.user._id,
    challengeId: req.params.id,
    status: "in_progress",
  });

  if (exists)
    throw { statusCode: 400, message: "Already joined this challenge" };

  const join = await UserChallenge.create({
    userId: req.user._id,
    challengeId: req.params.id,
    startedAt: new Date(),
  });

  res.status(201).json({ success: true, data: join });
});

exports.completeChallenge = catchAsync(async (req, res) => {
  const uc = await UserChallenge.findOne({
    userId: req.user._id,
    challengeId: req.params.id,
    status: "in_progress",
  });

  if (!uc)
    throw {
      statusCode: 400,
      message: "Challenge not joined or already completed",
    };

  const challenge = await Challenge.findById(req.params.id);
  if (!challenge) throw { statusCode: 404, message: "Challenge not found" };

  uc.status = "completed";
  uc.completedAt = new Date();
  await uc.save();

  await awardBadgeIfEligible(req.user._id, challenge.title, "challenge");
  const badge = await Badge.findOne({challengeId:challenge._id});
  if (badge){
    await awardBadgeIfEligible(req.user._id, badge.title, "badge");
  }
  

  res.json({
    success: true,
    data: {
      userChallenge: uc,
      xp: challenge.rewardXP,
    },
  });
});


exports.getActiveChallenges = catchAsync(async (req, res) => {
  const active = await UserChallenge.find({
    userId: req.user._id,
    status: 'in_progress'
  }).populate('challengeId');

  res.json({
    success: true,
    data: active
  });
});


exports.getAllChallenges = catchAsync(async (req, res) => {
  const challenges = await Challenge.find();
  res.status(200).json({
    success: true,
    data: challenges
  });
});


exports.updateChallenge = catchAsync(async (req, res) => {
  const { error } = challengeSchema.validate(req.body);
  if (error) throw { statusCode: 400, message: error.details[0].message };

  const challenge = await Challenge.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      description: req.body.description,
      rewardXP: req.body.rewardXP,
    },
    { new: true, runValidators: true }
  );

  if (!challenge) {
    return res.status(404).json({
      success: false,
      message: "Challenge not found"
    });
  }

  res.json({
    success: true,
    message: "Challenge updated successfully",
    data: challenge
  });
});


exports.deleteChallenge = catchAsync(async (req, res) => {
  const challenge = await Challenge.findByIdAndDelete(req.params.id);
  if (!challenge) {
    return res.status(404).json({
      success: false,
      message: "Challenge not found"
    });
  }

  await UserChallenge.deleteMany({ challengeId: req.params.id });
  await Badge.deleteOne({ challengeId: req.params.id });

  res.json({
    success: true,
    message: "Challenge deleted successfully"
  });
})



exports.createChallenge = catchAsync(async (req, res) => {
   const { error } = challengeSchema.validate(req.body);
      if (error) throw { statusCode: 400, message: error.details[0].message };
    
    const challenge = await Challenge.create({
    title: req.body.title,
    description: req.body.description,
    rewardXP: req.body.rewardXP
  });

  const users = await User.find({}, '_id');

  for (const user of users) {
    await createNotification(
      user._id,
      `وسع وسع للتحدى الجديد: ${challenge.title}`,
      'challenge'
    );
  }

  res.status(201).json({
    success: true,
    data: challenge
  });
});



cron.schedule("0 0 * * *", async () => {
  const now = new Date();

  ////////////////////////////////////////////////////
  const expiredGoals = await SavingGoal.find({
    deadline: { $lt: now },
    status: "active"
  });

  for (const goal of expiredGoals) {
    goal.status = "expired";
    await goal.save();

    await createNotification(
      goal.userId,
      `للأسف انتهت صلاحيه  "${goal.title}" يا حزين.`,
      "goal"
    );
  }
  ////////////////////////////////////////////////////////
  const expiredChallenges = await UserChallenge.find({
    startedAt: { $lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    status: "in_progress"
  });

  for (const uc of expiredChallenges) {
    uc.status = "failed";
    uc.completedAt = new Date();
    await uc.save();

    await createNotification(
      uc.userId,
      `فشلت فى التحدى.`,
      "challenge"
    );
  }

  console.log("Daily check: expired outdated goals/challenges");
});
