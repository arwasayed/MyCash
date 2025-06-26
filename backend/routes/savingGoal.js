const express = require('express');
const router = express.Router();
const { createSavingGoal, updateSavingGoal, getMySavingGoals, deleteSavingGoal } = require('../controllers/savingGoal');
const { auth } = require('../middlewares/auth');

router.post('/', auth, createSavingGoal);
router.patch('/:id', auth, updateSavingGoal);
router.get('/', auth, getMySavingGoals);
router.delete('/:id', auth, deleteSavingGoal);


module.exports = router;
