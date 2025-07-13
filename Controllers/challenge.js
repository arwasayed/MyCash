const catchAsync = require("../utils/catchAsync");
const { awardBadgeIfEligible } = require("../utils/badges");
const SavingGoal = require("../models/SavingGoal");
const UserChallenge = require("../models/UserChallenge");
const Challenge = require("../models/Challenge");
const { challengeSchema } = require('../validation/challenge.validation');
const cron = require("node-cron");
const { createNotification } = require("../Controllers/notification");
const User = require("../models/userModel");

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
