const express = require('express');
const router = express.Router();
const {
  getRecurringTransactions,
  addRecurringTransaction,
  getRecurringTransactionById,
  updateRecurringTransaction,
  deleteRecurringTransaction,
  processRecurringTransactions
} = require('../controllers/recurringTransactionController');

// Get all recurring transactions & Create new recurring transaction
router.route('/')
  .get(getRecurringTransactions)
  .post(addRecurringTransaction);

// Process recurring transactions
router.route('/process')
  .post(processRecurringTransactions);

// Get, update and delete recurring transaction by ID
router.route('/:id')
  .get(getRecurringTransactionById)
  .put(updateRecurringTransaction)
  .delete(deleteRecurringTransaction);

module.exports = router; 