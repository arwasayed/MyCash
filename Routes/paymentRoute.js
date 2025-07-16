const express = require("express");
const router = express.Router();
const stripe = require("../utils/stripe");
const User = require("../models/userModel");
const { protect } = require('../middlewares/authMiddleware');

router.post("/payment/create", protect, async (req, res) => {
    try {
      const { amount, currency, planType } = req.body;
  
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100, // Convert to cents
        currency: currency.toLowerCase(),
        payment_method_types: ["card"],
        metadata: {
          userId: req.user._id.toString(),
          planType: planType || "Monthly"
        }
      });
  
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (err) {
      console.error("Error creating payment intent:", err.message);
      res.status(500).json({ error: "Failed to create payment intent" });
    }
  });

router.post("/payment/confirm", protect, async (req, res) => {
    const { paymentIntentId } = req.body;
  
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
  
      if (paymentIntent.status !== "succeeded") {
        return res.status(400).json({ error: "Payment not successful yet" });
      }
  
      const planType = paymentIntent.metadata?.planType || "Monthly";
      const user = await User.findById(req.user._id);
      if (!user) return res.status(404).json({ error: "User not found" });
  
      user.subscribe = {
        type: planType,
        durationDays: planType === "Annual" ? 365 : 30,
        paymentMethod: "Card"
      };
  
      await user.save();
  
      res.json({
        success: true,
        message: `تم الاشتراك في باقة ${planType} بنجاح`,
        subscription: user.subscription
      });
    } catch (error) {
      console.error("Error confirming payment:", error.message);
      res.status(500).json({ error: "Failed to confirm payment" });
    }
  });
  
module.exports = router;