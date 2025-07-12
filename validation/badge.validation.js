const Joi =require('joi');

exports.badgeSchema = Joi.object({
    title: Joi.string()
      .min(3)
      .max(100)
      .required(),
    
    description: Joi.string()
      .required(),
  
    icon: Joi.string()
      .uri()
  });
  