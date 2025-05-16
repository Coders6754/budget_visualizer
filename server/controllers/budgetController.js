const Budget = require('../models/Budget');

// @desc    Get all budgets
// @route   GET /api/budgets
// @access  Public
exports.getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find().sort({ category: 1 });
    return res.status(200).json({
      success: true,
      count: budgets.length,
      data: budgets
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Add budget
// @route   POST /api/budgets
// @access  Public
exports.addBudget = async (req, res) => {
  try {
    const { category, amount, period } = req.body;

    // Simple validation
    if (!category || !amount) {
      return res.status(400).json({
        success: false,
        error: 'Please provide all required fields'
      });
    }

    // Check if budget for this category already exists
    const existingBudget = await Budget.findOne({ category });
    
    if (existingBudget) {
      // Update existing budget
      existingBudget.amount = amount;
      existingBudget.period = period || 'monthly';
      await existingBudget.save();
      
      return res.status(200).json({
        success: true,
        data: existingBudget
      });
    }

    // Create new budget
    const budget = await Budget.create(req.body);
    
    return res.status(201).json({
      success: true,
      data: budget
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        error: messages
      });
    }
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get budget by ID
// @route   GET /api/budgets/:id
// @access  Public
exports.getBudgetById = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);
    
    if (!budget) {
      return res.status(404).json({
        success: false,
        error: 'Budget not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: budget
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Update budget
// @route   PUT /api/budgets/:id
// @access  Public
exports.updateBudget = async (req, res) => {
  try {
    const budget = await Budget.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!budget) {
      return res.status(404).json({
        success: false,
        error: 'Budget not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: budget
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        error: messages
      });
    }
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Delete budget
// @route   DELETE /api/budgets/:id
// @access  Public
exports.deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);
    
    if (!budget) {
      return res.status(404).json({
        success: false,
        error: 'Budget not found'
      });
    }

    await budget.deleteOne();

    return res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
}; 