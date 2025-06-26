const Joi = require("joi");

exports.savingGoalSchema = Joi.object({
  title: Joi.string()
    .min(3)
    .max(100)
    .required(),
  
  targetAmount: Joi.number()
    .min(1)
    .required(),

  deadline: Joi.date()
    .greater('now')
    .required(),
  
  currentAmount: Joi.number()
    .min(0) 
    .optional()
});
