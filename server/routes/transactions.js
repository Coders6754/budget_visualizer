const express = require('express');
const router = express.Router();
const {
  getTransactions,
  addTransaction,
  getTransactionById, 
  updateTransaction,
  deleteTransaction
} = require('../controllers/transactionController');

// Get all transactions & Create new transaction
router.route('/')
  .get(getTransactions)
  .post(addTransaction);

// Get, update and delete transaction by ID
router.route('/:id')
  .get(getTransactionById)
  .put(updateTransaction) 
  .delete(deleteTransaction);

module.exports = router;