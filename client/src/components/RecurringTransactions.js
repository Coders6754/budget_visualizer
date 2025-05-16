import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { getRecurringTransactions, addRecurringTransaction, deleteRecurringTransaction } from '../services/api';

const RecurringTransactions = () => {
  const [recurringTransactions, setRecurringTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'expense',
    category: '',
    frequency: 'monthly',
    startDate: new Date().toISOString().slice(0, 10),
    active: true
  });

  useEffect(() => {
    fetchRecurringTransactions();
  }, []);

  const fetchRecurringTransactions = async () => {
    try {
      setLoading(true);
      const data = await getRecurringTransactions();
      const transactionsArray = Array.isArray(data) ? data : data.data || [];
      setRecurringTransactions(transactionsArray);
    } catch (error) {
      console.error('Error fetching recurring transactions:', error);
      toast.error('Failed to load recurring transactions');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.description.trim()) {
      toast.error('Please enter a description');
      return;
    }
    
    if (!formData.amount || formData.amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    if (!formData.category) {
      toast.error('Please select a category');
      return;
    }

    try {
      const recurringData = {
        description: formData.description,
        amount: formData.type === 'expense' ? -Math.abs(Number(formData.amount)) : Math.abs(Number(formData.amount)),
        category: formData.category,
        frequency: formData.frequency,
        startDate: formData.startDate,
        active: formData.active
      };
      
      const response = await addRecurringTransaction(recurringData);
      const newTransaction = response.data || response;
      
      setRecurringTransactions([...recurringTransactions, newTransaction]);
      setFormData({
        description: '',
        amount: '',
        type: 'expense',
        category: '',
        frequency: 'monthly',
        startDate: new Date().toISOString().slice(0, 10),
        active: true
      });
      setIsAddingNew(false);
      toast.success('Recurring transaction added successfully!');
    } catch (error) {
      console.error('Error adding recurring transaction:', error);
      toast.error('Failed to add recurring transaction');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteRecurringTransaction(id);
      setRecurringTransactions(recurringTransactions.filter(transaction => transaction._id !== id));
      toast.success('Recurring transaction removed');
    } catch (error) {
      console.error('Error deleting recurring transaction:', error);
      toast.error('Failed to remove recurring transaction');
    }
  };

  const toggleActive = async (transaction) => {
    try {
      const updatedTransaction = { ...transaction, active: !transaction.active };
      await addRecurringTransaction(updatedTransaction);
      
      setRecurringTransactions(recurringTransactions.map(t => 
        t._id === transaction._id ? { ...t, active: !t.active } : t
      ));
      
      toast.success(`Recurring transaction ${updatedTransaction.active ? 'activated' : 'paused'}`);
    } catch (error) {
      console.error('Error updating recurring transaction:', error);
      toast.error('Failed to update recurring transaction');
    }
  };

  const categories = {
    income: ['Salary', 'Freelance', 'Gift', 'Investment', 'Other'],
    expense: ['Food', 'Housing', 'Transportation', 'Entertainment', 'Utilities', 'Healthcare', 'Other']
  };

  const frequencies = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'biweekly', label: 'Every 2 Weeks' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'yearly', label: 'Yearly' }
  ];

  const getNextOccurrence = (startDate, frequency) => {
    const start = new Date(startDate);
    const today = new Date();
    let nextDate = new Date(start);
    
    while (nextDate < today) {
      switch (frequency) {
        case 'daily':
          nextDate.setDate(nextDate.getDate() + 1);
          break;
        case 'weekly':
          nextDate.setDate(nextDate.getDate() + 7);
          break;
        case 'biweekly':
          nextDate.setDate(nextDate.getDate() + 14);
          break;
        case 'monthly':
          nextDate.setMonth(nextDate.getMonth() + 1);
          break;
        case 'quarterly':
          nextDate.setMonth(nextDate.getMonth() + 3);
          break;
        case 'yearly':
          nextDate.setFullYear(nextDate.getFullYear() + 1);
          break;
        default:
          nextDate.setMonth(nextDate.getMonth() + 1);
      }
    }
    
    return nextDate.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-6">Recurring Transactions</h2>
        <p className="text-gray-500">Loading recurring transactions...</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Recurring Transactions</h2>
        <button 
          onClick={() => setIsAddingNew(!isAddingNew)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
        >
          {isAddingNew ? 'Cancel' : 'Add Recurring'}
        </button>
      </div>
      
      {isAddingNew && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-6 p-4 border border-blue-100 rounded-lg bg-blue-50"
        >
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Transaction Type
              </label>
              <div className="flex space-x-4">
                <label className={`flex-1 flex items-center justify-center p-2 rounded-lg cursor-pointer transition-colors duration-200 ${
                  formData.type === 'income' 
                    ? 'bg-green-100 text-green-700 border-2 border-green-500' 
                    : 'bg-gray-50 text-gray-700 border-2 border-transparent hover:bg-gray-100'
                }`}>
                  <input
                    type="radio"
                    name="type"
                    value="income"
                    checked={formData.type === 'income'}
                    onChange={handleChange}
                    className="hidden"
                  />
                  <span>Income</span>
                </label>
                <label className={`flex-1 flex items-center justify-center p-2 rounded-lg cursor-pointer transition-colors duration-200 ${
                  formData.type === 'expense'
                    ? 'bg-red-100 text-red-700 border-2 border-red-500'
                    : 'bg-gray-50 text-gray-700 border-2 border-transparent hover:bg-gray-100'
                }`}>
                  <input
                    type="radio"
                    name="type"
                    value="expense"
                    checked={formData.type === 'expense'}
                    onChange={handleChange}
                    className="hidden"
                  />
                  <span>Expense</span>
                </label>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Description
                </label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter description"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Amount ($)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>
              
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
                  {categories[formData.type].map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Frequency
                </label>
                <select
                  name="frequency"
                  value={formData.frequency}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {frequencies.map(freq => (
                    <option key={freq.value} value={freq.value}>{freq.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="active"
                  name="active"
                  checked={formData.active}
                  onChange={handleChange}
                  className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="active" className="text-gray-700 text-sm font-medium">
                  Active (will generate transactions)
                </label>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
              >
                Save Recurring Transaction
              </button>
            </div>
          </form>
        </motion.div>
      )}
      
      {recurringTransactions.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No recurring transactions set up yet.</p>
          <p className="text-gray-500 text-sm mt-2">Create a recurring transaction to automate regular income or expenses.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Frequency</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recurringTransactions.map(transaction => (
                <tr key={transaction._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{transaction.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${transaction.amount < 0 ? 'text-red-600' : 'text-green-600'}`}>
                      ${Math.abs(transaction.amount).toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{transaction.category}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {frequencies.find(f => f.value === transaction.frequency)?.label || 'Monthly'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {getNextOccurrence(transaction.startDate, transaction.frequency)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      transaction.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {transaction.active ? 'Active' : 'Paused'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => toggleActive(transaction)} 
                        className={`text-xs font-medium px-2 py-1 rounded ${
                          transaction.active 
                            ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' 
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        {transaction.active ? 'Pause' : 'Activate'}
                      </button>
                      <button 
                        onClick={() => handleDelete(transaction._id)} 
                        className="text-xs font-medium px-2 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RecurringTransactions; 