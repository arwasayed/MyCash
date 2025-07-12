const User = require("../models/userModel");
const PLANS = require("../config/plans");

exports.subscribe = async (req, res) => {
    try {
      const { plan } = req.body;
  
      const selectedPlan = PLANS[plan];
      if (!selectedPlan) {
        return res.status(400).json({
          success: false,
          message: "Invalid plan selected",
        });
      }
  
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }
  
      user.subscribe = { ...selectedPlan, paymentMethod: "VISA" };
      await user.save();
  
      res.status(200).json({
        success: true,
        message: `Subscribed to ${selectedPlan.type} plan`,
        data: user.subscription,
      });
    } catch (err) {
      console.error("Subscription error:", err);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };


exports.getPlans = (req, res) => {
    const plansList = Object.values(PLANS); 
    res.status(200).json({
      success: true,
      plans: plansList,
    });
  };