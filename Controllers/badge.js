const catchAsync = require('../utils/catchAsync');
const UserBadge = require('../models/UserBadge');
const Badge = require('../models/Badge');
const { badgeSchema } = require('../validation/badge.validation');


exports.createBadge = catchAsync(async (req, res) => {
  const { error } = badgeSchema.validate(req.body);
  if (error) throw { statusCode: 400, message: error.details[0].message };

  const badge = await Badge.create({
    title: req.body.title,
    description: req.body.description,
    iconUrl: req.body.iconUrl
  });

  res.status(201).json({
    success: true,
    data: badge
  });
});

exports.getBadges = catchAsync(async (req, res) => {
  const badges = await Badge.find();
  res.json({
    success: true,
    data: badges
  });
});

exports.getUserBadges = catchAsync(async (req, res) => {
  const userBadges = await UserBadge.find({ userId: req.user._id }).populate('badgeId');
  res.json({
    success: true,
    data: userBadges
  });
});

exports.deleteBadge = catchAsync(async (req, res) => {
  await Badge.findByIdAndDelete(req.params.id);
  await UserBadge.deleteMany({ badgeId: req.params.id });
  res.json({
    success: true,
    message: 'Badge deleted and unlinked from users'
  });
});



exports.awardBadgeIfEligible = async (userId, badgeTitle) => {
  const badge = await Badge.findOne({ title: badgeTitle });
  if (!badge) {
    console.log(`Badge not found: ${badgeTitle}`);
    return;
  }

  const already = await UserBadge.findOne({ userId, badgeId: badge._id });
  if (already) {
    console.log(`User ${userId} already has badge: ${badgeTitle}`);
    return;
  }

  await UserBadge.create({
    userId,
    badgeId: badge._id,
    unlockedAt: new Date()
  });

  console.log(`Badge awarded: ${badgeTitle} to user ${userId}`);
};
