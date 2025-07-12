const express = require("express");
const router = express.Router();
const { subscribe, getPlans } = require("../Controllers/subscription");
const { protect } = require('../middlewares/authMiddleware');

router.post("/", protect, subscribe);
router.get("/plans", getPlans);


module.exports = router;
