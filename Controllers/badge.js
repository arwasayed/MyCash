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
    iconUrl: req.body.iconUrl,
    challengeId: req.body.challengeId
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


exports.updateBadge = catchAsync(async (req, res) => {
  const { error } = badgeSchema.validate(req.body);
  if (error) { throw { statusCode: 400, message: error.details[0].message }; }

  const badge = await Badge.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      description: req.body.description,
      iconUrl: req.body.iconUrl,
      challengeId: req.body.challengeId,
    },
    { new: true, runValidators: true }
  );

  if (!badge) {
    return res.status(404).json({
      success: false,
      message: "Badge not found",
    });
  }

  res.json({
    success: true,
    message: "Badge updated successfully",
    data: badge,
  });
});
