const Joi =require('joi');

exports.updateGoalSchema = Joi.object({
    currentAmount: Joi.number()
      .min(0)
      .required()
  });
  