const Joi =require('joi');

exports.challengeSchema = Joi.object({
    title: Joi.string()
      .min(3)
      .max(100)
      .required(),
  
    description: Joi.string()
      .min(5)
      .required(),
  
    durationDays: Joi.number()
      .min(1),
  
    rewardXP: Joi.number()
      .min(0)
      .required(),
  
    isActive: Joi.boolean()
      .default(true)
      .optional()
  });
  