import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

const TransactionForm = ({ onAddTransaction }) => {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'expense',
    category: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { description, amount, type, category } = formData;

  const categories = {
    income: ['Salary', 'Freelance', 'Gift', 'Investment', 'Other'],
    expense: ['Food', 'Housing', 'Transportation', 'Entertainment', 'Utilities', 'Healthcare', 'Other']
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!description.trim()) {
      toast.error('Please enter a description');
      return;
    }
    
    if (!amount || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    if (!category) {
      toast.error('Please select a category');
      return;
    }

    setIsSubmitting(true);

    try {
      await onAddTransaction({
        description,
        amount: type === 'expense' ? -Math.abs(Number(amount)) : Math.abs(Number(amount)),
        type,
        category
      });

      // Reset form
      setFormData({
        description: '',
        amount: '',
        type: 'expense',
        category: '',
      });
    } catch (error) {
      console.error('Error adding transaction:', error);
      toast.error('Failed to add transaction');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-xl shadow-lg mb-6"
    >
      <h2 className="text-xl font-bold mb-6 text-gray-800">Add New Transaction</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-medium mb-3">
            Transaction Type
          </label>
          <div className="flex space-x-4">
            <label className={`flex-1 flex items-center justify-center p-3 rounded-lg cursor-pointer transition-colors duration-200 ${
              type === 'income' 
                ? 'bg-green-100 text-green-700 border-2 border-green-500' 
                : 'bg-gray-50 text-gray-700 border-2 border-transparent hover:bg-gray-100'
            }`}>
              <input
                type="radio"
                name="type"
                value="income"
                checked={type === 'income'}
                onChange={handleChange}
                className="hidden"
              />
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Income</span>
            </label>
            <label className={`flex-1 flex items-center justify-center p-3 rounded-lg cursor-pointer transition-colors duration-200 ${
              type === 'expense'
                ? 'bg-red-100 text-red-700 border-2 border-red-500'
                : 'bg-gray-50 text-gray-700 border-2 border-transparent hover:bg-gray-100'
            }`}>
              <input
                type="radio"
                name="type"
                value="expense"
                checked={type === 'expense'}
                onChange={handleChange}
                className="hidden"
              />
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
              <span>Expense</span>
            </label>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Description
          </label>
          <input
            type="text"
            name="description"
            value={description}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            placeholder="Enter description"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Amount ($)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
            <input
              type="number"
              name="amount"
              value={amount}
              onChange={handleChange}
              className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Category
          </label>
          <select
            name="category"
            value={category}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 appearance-none bg-white"
          >
            <option value="">Select category</option>
            {categories[type].map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 px-4 rounded-lg font-medium text-white transition duration-200 ${
            isSubmitting
              ? 'bg-blue-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Adding...
            </div>
          ) : (
            'Add Transaction'
          )}
        </button>
      </form>
    </motion.div>
  );
};

export default TransactionForm;