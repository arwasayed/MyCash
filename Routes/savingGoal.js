const express = require('express');
const router = express.Router();
const { createSavingGoal, updateSavingGoal, getMySavingGoals, deleteSavingGoal } = require('../Controllers/savingGoal');
const { protect } = require('../middlewares/authMiddleware');

router.post('/', protect, createSavingGoal);
router.patch('/:id', protect, updateSavingGoal);
router.get('/', protect, getMySavingGoals);
router.delete('/:id', protect, deleteSavingGoal);


module.exports = router;
