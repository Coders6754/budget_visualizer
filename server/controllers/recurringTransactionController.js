const RecurringTransaction = require('../models/RecurringTransaction');
const Transaction = require('../models/Transaction');

// @desc    Get all recurring transactions
// @route   GET /api/recurring
// @access  Public
exports.getRecurringTransactions = async (req, res) => {
    try {
        const recurringTransactions = await RecurringTransaction.find().sort({ createdAt: -1 });
        return res.status(200).json({
            success: true,
            count: recurringTransactions.length,
            data: recurringTransactions
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// @desc    Add recurring transaction
// @route   POST /api/recurring
// @access  Public
exports.addRecurringTransaction = async (req, res) => {
    try {
        const { description, amount, category, frequency, startDate, active } = req.body;

        // Simple validation
        if (!description || !amount || !category || !frequency) {
            return res.status(400).json({
                success: false,
                error: 'Please provide all required fields'
            });
        }

        const recurringTransaction = await RecurringTransaction.create(req.body);

        return res.status(201).json({
            success: true,
            data: recurringTransaction
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

// @desc    Get recurring transaction by ID
// @route   GET /api/recurring/:id
// @access  Public
exports.getRecurringTransactionById = async (req, res) => {
    try {
        const recurringTransaction = await RecurringTransaction.findById(req.params.id);

        if (!recurringTransaction) {
            return res.status(404).json({
                success: false,
                error: 'Recurring transaction not found'
            });
        }

        return res.status(200).json({
            success: true,
            data: recurringTransaction
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// @desc    Update recurring transaction
// @route   PUT /api/recurring/:id
// @access  Public
exports.updateRecurringTransaction = async (req, res) => {
    try {
        const recurringTransaction = await RecurringTransaction.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!recurringTransaction) {
            return res.status(404).json({
                success: false,
                error: 'Recurring transaction not found'
            });
        }

        return res.status(200).json({
            success: true,
            data: recurringTransaction
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

// @desc    Delete recurring transaction
// @route   DELETE /api/recurring/:id
// @access  Public
exports.deleteRecurringTransaction = async (req, res) => {
    try {
        const recurringTransaction = await RecurringTransaction.findById(req.params.id);

        if (!recurringTransaction) {
            return res.status(404).json({
                success: false,
                error: 'Recurring transaction not found'
            });
        }

        await recurringTransaction.deleteOne();

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

// @desc    Process recurring transactions
// @route   POST /api/recurring/process
// @access  Public
exports.processRecurringTransactions = async (req, res) => {
    try {
        const today = new Date();
        const activeRecurringTransactions = await RecurringTransaction.find({ active: true });

        let processed = 0;
        let errors = 0;

        for (const rt of activeRecurringTransactions) {
            try {
                // Determine if transaction should be created based on frequency and last processed date
                const shouldProcess = shouldCreateTransaction(rt, today);

                if (shouldProcess) {
                    // Create a new transaction
                    const transaction = await Transaction.create({
                        description: rt.description,
                        amount: rt.amount,
                        category: rt.category,
                        date: today
                    });

                    // Update the lastProcessed date for the recurring transaction
                    rt.lastProcessed = today;
                    await rt.save();

                    processed++;
                }
            } catch (error) {
                console.error(`Error processing recurring transaction ${rt._id}:`, error);
                errors++;
            }
        }

        return res.status(200).json({
            success: true,
            processed,
            errors,
            message: `Processed ${processed} recurring transactions with ${errors} errors`
        });
    } catch (err) {
        console.error('Error processing recurring transactions:', err);
        return res.status(500).json({
            success: false,
            error: 'Server Error processing recurring transactions'
        });
    }
};

// Helper function to determine if a transaction should be created
const shouldCreateTransaction = (recurringTransaction, today) => {
    const startDate = new Date(recurringTransaction.startDate);
    const lastProcessed = recurringTransaction.lastProcessed ? new Date(recurringTransaction.lastProcessed) : null;

    // If transaction hasn't started yet
    if (startDate > today) {
        return false;
    }

    // If never processed before, we should process it
    if (!lastProcessed) {
        return true;
    }

    const frequency = recurringTransaction.frequency;
    const daysSinceLastProcessed = Math.floor((today - lastProcessed) / (1000 * 60 * 60 * 24));

    switch (frequency) {
        case 'daily':
            return daysSinceLastProcessed >= 1;
        case 'weekly':
            return daysSinceLastProcessed >= 7;
        case 'biweekly':
            return daysSinceLastProcessed >= 14;
        case 'monthly':
            // Check if we're in a different month
            return (today.getMonth() !== lastProcessed.getMonth()) ||
                (today.getFullYear() !== lastProcessed.getFullYear());
        case 'quarterly':
            // Check if it's been at least 3 months
            const monthDiff = (today.getFullYear() - lastProcessed.getFullYear()) * 12 +
                (today.getMonth() - lastProcessed.getMonth());
            return monthDiff >= 3;
        case 'yearly':
            // Check if it's been at least a year
            return today.getFullYear() > lastProcessed.getFullYear();
        default:
            return false;
    }
}; 