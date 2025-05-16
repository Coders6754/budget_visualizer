const mongoose = require('mongoose');

const BudgetSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  period: {
    type: String,
    required: true,
    enum: ['weekly', 'monthly', 'yearly'],
    default: 'monthly'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Budget', BudgetSchema); 