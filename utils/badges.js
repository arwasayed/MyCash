const Badge = require("../models/Badge");
const UserBadge = require("../models/UserBadge");
const { createNotification } = require("../Controllers/notification");

exports.awardBadgeIfEligible = async (userId, badgeTitle, type) => {
  if (type == "badge") {
    const badge = await Badge.findOne({ title: badgeTitle });
    if (!badge) {
      console.warn(`Badge with title "${badgeTitle}" not found`);
      return;
    }

    const alreadyAwarded = await UserBadge.findOne({
      userId,
      badgeId: badge._id,
    });

    if (alreadyAwarded) {
      console.log(`User ${userId} already has badge "${badgeTitle}"`);
      return;
    }

    await UserBadge.create({
      userId,
      badgeId: badge._id,
      unlockedAt: new Date(),
    });
  }

  await createNotification(
    userId,
    `اشطر كتكوت, مبروك نجحت تحقق ${badgeTitle} يا اسطا.`,
    type
  );

  console.log(`Badge "${badgeTitle}" awarded to user ${userId}`);
};
