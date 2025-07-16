const catchAsync = require("../utils/catchAsync");
const { awardBadgeIfEligible } = require("../utils/badges");
const SavingGoal = require("../models/SavingGoal");
const UserChallenge = require("../models/UserChallenge");
const Challenge = require("../models/Challenge");
const { challengeSchema } = require("../validation/challenge.validation");
const cron = require("node-cron");
const { createNotification } = require("../Controllers/notification");
const User = require("../models/userModel");
const Badge = require("../models/Badge");
const { formatUserProfile } = require("../utils/userProfileFormatter");
const { OpenAI } = require("openai");
const Income = require("../models/Income");
const Expense = require("../models/Expense");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });




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

  const user = await User.findById(req.user._id);
  user.points = (user.points || 0) + challenge.rewardXP;
  await user.save();

  await awardBadgeIfEligible(req.user._id, challenge.title, "challenge");
  const badge = await Badge.findOne({ challengeId: challenge._id });
  if (badge) {
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





exports.getUserChallenges = catchAsync(async (req, res) => {
  const user_id = req.user._id;

    const userChallenges = await UserChallenge.find({ user_id }).populate("challengeId");
  const joinedChallengeIds = userChallenges.map((uc) => uc.challengeId?._id.toString());

    const staticChallenges = await Challenge.find({
    isPersonalized: false,
    _id: { $nin: joinedChallengeIds }
  });

    const personalizedChallenges = await Challenge.find({
    isPersonalized: true,
    userId: user_id,
  });
  console.log(personalizedChallenges);
  

  res.json({
    success: true,
    data: {
      staticChallenges,
      personalizedChallenges,
      activeChallenges: userChallenges.filter((uc) => uc.status === "in_progress"),
    },
  });
});





exports.getAllChallenges = catchAsync(async (req, res) => {
  const challenges = await Challenge.find();
  res.status(200).json({
    success: true,
    data: challenges,
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
      message: "Challenge not found",
    });
  }

  res.json({
    success: true,
    message: "Challenge updated successfully",
    data: challenge,
  });
});





exports.deleteChallenge = catchAsync(async (req, res) => {
  const challenge = await Challenge.findByIdAndDelete(req.params.id);
  if (!challenge) {
    return res.status(404).json({
      success: false,
      message: "Challenge not found",
    });
  }

  await UserChallenge.deleteMany({ challengeId: req.params.id });
  await Badge.deleteOne({ challengeId: req.params.id });

  res.json({
    success: true,
    message: "Challenge deleted successfully",
  });
});






exports.createChallenge = catchAsync(async (req, res) => {
  const { error } = challengeSchema.validate(req.body);
  if (error) throw { statusCode: 400, message: error.details[0].message };

  const challenge = await Challenge.create({
    title: req.body.title,
    description: req.body.description,
    rewardXP: req.body.rewardXP,
  });

  const users = await User.find({}, "_id");

  for (const user of users) {
    await createNotification(
      user._id,
      `وسع وسع للتحدى الجديد: ${challenge.title}`,
      "challenge"
    );
  }

  res.status(201).json({
    success: true,
    data: challenge,
  });
});









cron.schedule("0 0 * * *", async () => {
  const now = new Date();

  ////////////////////////////////////////////////////
  const expiredGoals = await SavingGoal.find({
    deadline: { $lt: now },
    status: "active",
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
    status: "in_progress",
  });

  for (const uc of expiredChallenges) {
    uc.status = "failed";
    uc.completedAt = new Date();
    await uc.save();

    await createNotification(uc.userId, `فشلت فى التحدى.`, "challenge");
  }

  console.log("Daily check: expired outdated goals/challenges");
});














cron.schedule("0 3 1 * *", async () => {
  const subscribedUsers = await User.find({
    "subscription.status": "active"
  });

  for (const user of subscribedUsers) {
    try {
      const challenges = await UserChallenge.find({ userId: user._id });
      const incomes = await Income.find({ user_id: user._id });
      const expenses = await Expense.find({ user_id: user._id });

      const profileText = formatUserProfile({ user, challenges, incomes, expenses });

      const prompt = `
Based on the following user profile, suggest three unrepeated personalized savings challenges and associated badges in colloquial Egyptian Arabic.

User Profile:
${profileText}

IMPORTANT: You MUST return ONLY valid JSON in this exact format:
{
  "challenge": {
    "title": "",
    "description": "",
    "durationDays": 7,
    "rewardXP": 100
  },
  "badge": {
    "title": "",
    "description": "",
    "iconUrl": ""
  }
}
ONLY JSON! No other text or commentary.
      `;

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are Mycash, an Egyptian financial advisor bot.
                    Speak in colloquial Egyptian Arabic.
                    Use only the context provided below.
                    Keep replies short and cheerful.`,
          },
          { role: "user", content: prompt },
        ],
        max_tokens: 150,
        temperature: 0.7,
      });

      const raw = completion.choices[0].message.content;
      const start = raw.indexOf("{");
      const end = raw.lastIndexOf("}");
      const jsonString = raw.slice(start, end + 1);
      const generated = JSON.parse(jsonString);

      const newChallenge = await Challenge.create({
        ...generated.challenge,
        userId: user._id,
        isPersonalized: true,
      });

      const newBadge = await Badge.create({
        ...generated.badge,
        challengeId: newChallenge._id,
      });

      await createNotification(
        user._id,
        ` تم نشاء تحدي جديد مخصوص ليك: "${generated.challenge.title}"`,
        "challenge"
      );

      console.log(`Personalized challenge generated for ${user.email}`);
    } catch (err) {
      console.error(` Failed for ${user.email}:`, err.message);
    }
  }
});
