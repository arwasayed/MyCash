const catchAsync = require("../utils/catchAsync");
const { awardBadgeIfEligible } = require("../utils/badges");
const SavingGoal = require("../models/SavingGoal");
const UserChallenge = require("../models/UserChallenge");
const Challenge = require("../models/Challenge");
const { challengeSchema } = require('../validation/challenge.validation');
const cron = require("node-cron");

exports.joinChallenge = catchAsync(async (req, res) => {
  const exists = await UserChallenge.findOne({
    userId: req.id,
    challengeId: req.params.id,
    status: "in_progress",
  });

  if (exists)
    throw { statusCode: 400, message: "Already joined this challenge" };

  const join = await UserChallenge.create({
    userId: req.id,
    challengeId: req.params.id,
    startedAt: new Date(),
  });

  res.status(201).json({ success: true, data: join });
});

exports.completeChallenge = catchAsync(async (req, res) => {
  const uc = await UserChallenge.findOne({
    userId: req.id,
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

  await awardBadgeIfEligible(req.id, "Challenge Hero");

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
    userId: req.id,
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

  res.status(201).json({
    success: true,
    data: challenge
  });
});



cron.schedule("0 0 * * *", async () => {
  await SavingGoal.updateMany(
    { deadline: { $lt: new Date() }, status: "active" },
    { status: "expired" }
  );

  await UserChallenge.updateMany(
    {
      startedAt: { $lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      status: "in_progress",
    },
    { status: "failed" }
  );

  console.log("Daily check: expired outdated goals/challenges");
});
