const Badge = require('../models/Badge');
const UserBadge = require('../models/UserBadge');

exports.awardBadgeIfEligible = async (userId, badgeTitle) => {
  const badge = await Badge.findOne({ title: badgeTitle });
  if (!badge) {
    console.warn(`Badge with title "${badgeTitle}" not found`);
    return;
  }
  
  const alreadyAwarded = await UserBadge.findOne({
    userId,
    badgeId: badge._id
  });

  if (alreadyAwarded) {
    console.log(`User ${userId} already has badge "${badgeTitle}"`);
    return;
  }
  
  await UserBadge.create({
    userId,
    badgeId: badge._id,
    unlockedAt: new Date()
  });

  console.log(`Badge "${badgeTitle}" awarded to user ${userId}`);
};
