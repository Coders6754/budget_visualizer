const express = require('express');
const router = express.Router();
const {
  getBudgets,
  addBudget,
  getBudgetById,
  updateBudget,
  deleteBudget
} = require('../controllers/budgetController');

// Get all budgets & Create new budget
router.route('/')
  .get(getBudgets)
  .post(addBudget);

// Get, update and delete budget by ID
router.route('/:id')
  .get(getBudgetById)
  .put(updateBudget)
  .delete(deleteBudget);

module.exports = router; 