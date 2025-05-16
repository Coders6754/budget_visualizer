import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const Settings = ({ initialSettings, onSettingsUpdate }) => {
  const [settings, setSettings] = useState({
    currency: 'USD',
    dateFormat: 'MM/DD/YYYY',
    defaultView: 'dashboard',
    notifications: true,
    categories: {
      income: ['Salary', 'Freelance', 'Gift', 'Investment', 'Other'],
      expense: ['Food', 'Housing', 'Transportation', 'Entertainment', 'Utilities', 'Healthcare', 'Shopping', 'Education', 'Travel', 'Debt', 'Savings', 'Other']
    }
  });

  const [newCategory, setNewCategory] = useState({
    name: '',
    type: 'expense'
  });

  useEffect(() => {
    // Use initialSettings if provided
    if (initialSettings) {
      setSettings(initialSettings);
    } else {
      // Fallback to localStorage if initialSettings is not provided
      const savedSettings = localStorage.getItem('budgetAppSettings');
      if (savedSettings) {
        try {
          const parsedSettings = JSON.parse(savedSettings);
          setSettings(parsedSettings);
        } catch (error) {
          console.error('Error parsing settings:', error);
        }
      }
    }
  }, [initialSettings]);

  const saveSettings = () => {
    // Save settings to localStorage
    localStorage.setItem('budgetAppSettings', JSON.stringify(settings));
    
    // Notify parent component
    if (onSettingsUpdate) {
      onSettingsUpdate(settings);
    }
    
    toast.success('Settings saved successfully!');
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleNewCategoryChange = (e) => {
    const { name, value } = e.target;
    setNewCategory({
      ...newCategory,
      [name]: value
    });
  };

  const addCategory = () => {
    if (!newCategory.name.trim()) {
      toast.error('Please enter a category name');
      return;
    }

    // Check if category already exists
    if (settings.categories[newCategory.type].includes(newCategory.name)) {
      toast.error(`Category "${newCategory.name}" already exists`);
      return;
    }

    // Add new category
    setSettings({
      ...settings,
      categories: {
        ...settings.categories,
        [newCategory.type]: [
          ...settings.categories[newCategory.type],
          newCategory.name
        ]
      }
    });

    // Reset form
    setNewCategory({
      name: '',
      type: 'expense'
    });

    toast.success(`Category "${newCategory.name}" added successfully!`);
  };

  const removeCategory = (type, category) => {
    // Don't allow removing the last category
    if (settings.categories[type].length <= 1) {
      toast.error(`Cannot remove the last ${type} category`);
      return;
    }

    setSettings({
      ...settings,
      categories: {
        ...settings.categories,
        [type]: settings.categories[type].filter(c => c !== category)
      }
    });

    toast.success(`Category "${category}" removed`);
  };

  const currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
    { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' }
  ];

  const dateFormats = [
    { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY (US)' },
    { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY (UK/EU)' },
    { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD (ISO)' }
  ];

  const viewOptions = [
    { value: 'dashboard', label: 'Dashboard' },
    { value: 'budget', label: 'Budget Planner' },
    { value: 'recurring', label: 'Recurring Transactions' },
    { value: 'export', label: 'Export' },
    { value: 'settings', label: 'Settings' }
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Settings</h2>
        <button
          onClick={saveSettings}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
        >
          Save Settings
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Appearance & Display Settings */}
        <div>
          <h3 className="text-lg font-medium mb-4">Appearance & Display</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Currency
            </label>
            <select
              name="currency"
              value={settings.currency}
              onChange={handleChange}
              className="w-full px-4 py-2 border bg-white border-gray-300 text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {currencies.map(currency => (
                <option key={currency.code} value={currency.code}>
                  {currency.code} - {currency.symbol} - {currency.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Date Format
            </label>
            <select
              name="dateFormat"
              value={settings.dateFormat}
              onChange={handleChange}
              className="w-full px-4 py-2 border bg-white border-gray-300 text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {dateFormats.map(format => (
                <option key={format.value} value={format.value}>
                  {format.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Default View
            </label>
            <select
              name="defaultView"
              value={settings.defaultView}
              onChange={handleChange}
              className="w-full px-4 py-2 border bg-white border-gray-300 text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {viewOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="notifications"
                checked={settings.notifications}
                onChange={handleChange}
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 rounded"
              />
              <span className="text-sm font-medium">Enable Notifications</span>
            </label>
          </div>
        </div>
        
        {/* Categories Management */}
        <div>
          <h3 className="text-lg font-medium mb-4">Categories Management</h3>
          
          <div className="mb-4">
            <h4 className="text-md font-medium mb-2">Income Categories</h4>
            <div className="flex flex-wrap gap-2 mb-4">
              {settings.categories.income.map(category => (
                <div 
                  key={category} 
                  className="flex items-center bg-green-100 text-green-800 rounded-full px-3 py-1"
                >
                  <span>{category}</span>
                  <button
                    onClick={() => removeCategory('income', category)}
                    className="ml-2 text-green-600 hover:text-green-800"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
            
            <h4 className="text-md font-medium mb-2">Expense Categories</h4>
            <div className="flex flex-wrap gap-2 mb-4">
              {settings.categories.expense.map(category => (
                <div 
                  key={category} 
                  className="flex items-center bg-red-100 text-red-800 rounded-full px-3 py-1"
                >
                  <span>{category}</span>
                  <button
                    onClick={() => removeCategory('expense', category)}
                    className="ml-2 text-red-600 hover:text-red-800"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
            
            <div className="p-4 rounded-lg bg-gray-50">
              <h4 className="text-md font-medium mb-3">Add New Category</h4>
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <input
                    type="text"
                    name="name"
                    value={newCategory.name}
                    onChange={handleNewCategoryChange}
                    placeholder="Category name"
                    className="w-full px-4 py-2 border bg-white border-gray-300 text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <select
                    name="type"
                    value={newCategory.type}
                    onChange={handleNewCategoryChange}
                    className="w-full px-4 py-2 border bg-white border-gray-300 text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </div>
              </div>
              <div className="mt-3">
                <button
                  onClick={addCategory}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                >
                  Add Category
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 pt-6 border-gray-200 border-t">
        <h3 className="text-lg font-medium mb-4">Data Management</h3>
        <div className="flex space-x-4">
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to clear all data? This cannot be undone.')) {
                localStorage.removeItem('transactions');
                localStorage.removeItem('budgets');
                localStorage.removeItem('recurringTransactions');
                toast.success('All data has been cleared');
                setTimeout(() => window.location.reload(), 1500);
              }
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200"
          >
            Clear All Data
          </button>
          
          <button
            onClick={() => {
              const demoData = {
                settings: settings,
                transactions: [
                  { _id: '1', description: 'Monthly Salary', amount: 3500, category: 'Salary', type: 'income', date: new Date() },
                  { _id: '2', description: 'Rent Payment', amount: -1200, category: 'Housing', type: 'expense', date: new Date() },
                  { _id: '3', description: 'Grocery Shopping', amount: -150, category: 'Food', type: 'expense', date: new Date() },
                  { _id: '4', description: 'Freelance Work', amount: 500, category: 'Freelance', type: 'income', date: new Date() }
                ]
              };
              
              localStorage.setItem('demoData', JSON.stringify(demoData));
              toast.success('Demo data loaded successfully');
              setTimeout(() => window.location.reload(), 1500);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Load Demo Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings; 