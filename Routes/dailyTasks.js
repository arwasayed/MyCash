const express = require('express');
const router = express.Router();
const { getDailyTasks, completeTask } = require('../Controllers/dailyTasks');
const { protect } = require('../middlewares/authMiddleware');

router.get('/', protect, getDailyTasks);
router.post('/:taskKey/complete', protect, completeTask);

module.exports = router;
