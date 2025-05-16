import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { getBudgets, addBudget, updateBudget, deleteBudget } from '../services/api';

const BudgetPlanner = ({ transactions }) => {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    period: 'monthly'
  });

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      const data = await getBudgets();
      const budgetsArray = Array.isArray(data) ? data : data.data || [];
      setBudgets(budgetsArray);
    } catch (error) {
      console.error('Error fetching budgets:', error);
      toast.error('Failed to load budgets');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.category.trim()) {
      toast.error('Please select a category');
      return;
    }
    
    if (!formData.amount || formData.amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    try {
      const budgetData = {
        category: formData.category,
        amount: Number(formData.amount),
        period: formData.period
      };
      
      const response = await addBudget(budgetData);
      const newBudget = response.data || response;
      
      setBudgets([...budgets, newBudget]);
      setFormData({ category: '', amount: '', period: 'monthly' });
      setIsAdding(false);
      toast.success('Budget target added successfully!');
    } catch (error) {
      console.error('Error adding budget:', error);
      toast.error('Failed to add budget target');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteBudget(id);
      setBudgets(budgets.filter(budget => budget._id !== id));
      toast.success('Budget target removed');
    } catch (error) {
      console.error('Error deleting budget:', error);
      toast.error('Failed to remove budget target');
    }
  };

  // Calculate spend by category for the current month
  const getSpendByCategory = (category) => {
    if (!Array.isArray(transactions)) return 0;
    
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return transactions
      .filter(t => {
        if (!t || !t.category || !t.date) return false;
        const transactionDate = new Date(t.date);
        return t.category === category && 
               t.amount < 0 && 
               transactionDate.getMonth() === currentMonth &&
               transactionDate.getFullYear() === currentYear;
      })
      .reduce((total, t) => total + Math.abs(t.amount), 0);
  };

  const categories = [
    'Food', 'Housing', 'Transportation', 'Entertainment', 
    'Utilities', 'Healthcare', 'Shopping', 'Education',
    'Travel', 'Debt', 'Savings', 'Other'
  ];

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-6">Budget Planner</h2>
        <p className="text-gray-500">Loading budget data...</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Budget Planner</h2>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
        >
          {isAdding ? 'Cancel' : 'Add Budget Target'}
        </button>
      </div>
      
      {isAdding && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-6 p-4 border border-blue-100 rounded-lg bg-blue-50"
        >
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Budget Amount ($)
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Period
                </label>
                <select
                  name="period"
                  value={formData.period}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="monthly">Monthly</option>
                  <option value="weekly">Weekly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
              >
                Save Budget Target
              </button>
            </div>
          </form>
        </motion.div>
      )}
      
      {budgets.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No budget targets set yet.</p>
          <p className="text-gray-500 text-sm mt-2">Create a budget target to track your spending goals.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {budgets.map(budget => {
            const spend = getSpendByCategory(budget.category);
            const percentage = budget.amount > 0 ? (spend / budget.amount) * 100 : 0;
            const isOverBudget = percentage > 100;
            
            return (
              <div 
                key={budget._id} 
                className="border rounded-lg p-4 hover:shadow-md transition duration-200"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">{budget.category}</h3>
                  <div className="text-sm text-gray-500">{budget.period}</div>
                </div>
                
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <span className="text-lg font-bold">${spend.toFixed(2)}</span>
                    <span className="text-gray-500 ml-1">of ${budget.amount.toFixed(2)}</span>
                  </div>
                  <button
                    onClick={() => handleDelete(budget._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full ${isOverBudget ? 'bg-red-600' : 'bg-green-600'}`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  ></div>
                </div>
                
                <div className="mt-2 text-sm">
                  {isOverBudget ? (
                    <span className="text-red-600 font-medium">
                      Over budget by ${(spend - budget.amount).toFixed(2)}
                    </span>
                  ) : (
                    <span className="text-green-600 font-medium">
                      ${(budget.amount - spend).toFixed(2)} remaining
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BudgetPlanner; 