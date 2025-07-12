const PLANS = {
    Free: {
      type: 'Free',
      price: 0,
      durationDays: 30,
      features: ['Basic saving goals'],
    },
    Premium: {
      type: 'Premium',
      price: 50,
      durationDays: 30,
      features: ['Saving goals', 'Challenges', 'Badges'],
    }, 
    Pro: {
        type: 'Pro',
        price: 100,
        durationDays: 30,
        features: ['ChatBot'],
      },
  };
  
  module.exports = PLANS;
  