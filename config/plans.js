const PLANS = {
    Free: {
      type: 'Free',
      price: 0,
      durationDays: 30,
      features: ['Basic saving goals and challenges.'],
    },
    Annual: {
      type: 'Annual',
      price: 500,
      durationDays: 365,
      features: ['ChatBot'],
    }, 
    Monthly: {
        type: 'Monthly',
        price: 50,
        durationDays: 30,
        features: ['ChatBot'],
      },
  };
  
  module.exports = PLANS;
  