import React, { useState, useEffect } from 'react';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import BudgetPlanner from './components/BudgetPlanner';
import RecurringTransactions from './components/RecurringTransactions';
import ExportData from './components/ExportData';
import Settings from './components/Settings';
import { getAllTransactions, addTransaction, deleteTransaction, processRecurringTransactions } from './services/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formVisible, setFormVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [appSettings, setAppSettings] = useState({
    currency: 'USD',
    dateFormat: 'MM/DD/YYYY',
    defaultView: 'dashboard',
    notifications: true,
    categories: {
      income: ['Salary', 'Freelance', 'Gift', 'Investment', 'Other'],
      expense: ['Food', 'Housing', 'Transportation', 'Entertainment', 'Utilities', 'Healthcare', 'Shopping', 'Education', 'Travel', 'Debt', 'Savings', 'Other']
    }
  });
  
  // Set a constant theme for the app (light mode)
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('budgetAppSettings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setAppSettings(parsedSettings);
        
        // Set active tab based on default view if it exists
        if (parsedSettings.defaultView) {
          setActiveTab(parsedSettings.defaultView);
        }
      } catch (error) {
        console.error('Error parsing settings:', error);
      }
    }

    fetchTransactions();
    // Process recurring transactions when app loads
    handleProcessRecurring();
  }, []);

  const handleSettingsUpdate = (newSettings) => {
    setAppSettings(newSettings);
    
    // Set default view if changed
    if (newSettings.defaultView !== appSettings.defaultView) {
      setActiveTab(newSettings.defaultView);
    }
  };

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const data = await getAllTransactions();
      // Handle both array and object response formats
      const transactionsArray = Array.isArray(data) ? data : data.data || [];
      setTransactions(transactionsArray);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast.error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTransaction = async (transaction) => {
    try {
      const response = await addTransaction(transaction);
      // Handle both response formats
      const newTransaction = response.data || response;
      
      // Update transactions state with the new transaction
      setTransactions(prevTransactions => [newTransaction, ...prevTransactions]);
      setFormVisible(false);
      toast.success('Transaction added successfully!');
    } catch (error) {
      console.error('Error adding transaction:', error);
      toast.error('Failed to add transaction');
    }
  };

  const handleDeleteTransaction = async (id) => {
    try {
      await deleteTransaction(id);
      setTransactions(prevTransactions => 
        prevTransactions.filter(transaction => transaction._id !== id)
      );
      toast.success('Transaction deleted successfully!');
    } catch (error) {
      console.error('Error deleting transaction:', error);
      toast.error('Failed to delete transaction');
    }
  };

  const handleProcessRecurring = async () => {
    try {
      const result = await processRecurringTransactions();
      if (result.processed > 0) {
        toast.success(`Created ${result.processed} recurring transactions`);
        // Refresh transactions list to show new transactions
        fetchTransactions();
      }
    } catch (error) {
      console.error('Error processing recurring transactions:', error);
    }
  };

  // Calculate total balance for the header with safety check
  const totalBalance = Array.isArray(transactions) 
    ? transactions.reduce((sum, transaction) => {
        // Also add a check to ensure amount is a number
        const amount = transaction && typeof transaction.amount === 'number' 
          ? transaction.amount 
          : 0;
        return sum + amount;
      }, 0)
    : 0;

  // Find the selected currency symbol
  const getCurrencySymbol = () => {
    const currencies = [
      { code: 'USD', symbol: '$' },
      { code: 'EUR', symbol: '€' },
      { code: 'GBP', symbol: '£' },
      { code: 'JPY', symbol: '¥' },
      { code: 'CAD', symbol: 'C$' },
      { code: 'AUD', symbol: 'A$' },
      { code: 'INR', symbol: '₹' },
      { code: 'CNY', symbol: '¥' }
    ];
    
    const foundCurrency = currencies.find(c => c.code === appSettings.currency);
    return foundCurrency ? foundCurrency.symbol : '$';
  };

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard 
          transactions={transactions} 
          loading={loading} 
          currencySymbol={getCurrencySymbol()}
          isDarkMode={isDarkMode}
        />;
      case 'budget':
        return <BudgetPlanner 
          transactions={transactions} 
          currencySymbol={getCurrencySymbol()}
          isDarkMode={isDarkMode}
        />;
      case 'recurring':
        return <RecurringTransactions 
          currencySymbol={getCurrencySymbol()}
          isDarkMode={isDarkMode}
        />;
      case 'export':
        return <ExportData 
          transactions={transactions} 
          isDarkMode={isDarkMode}
        />;
      case 'settings':
        return <Settings 
          initialSettings={appSettings}
          onSettingsUpdate={handleSettingsUpdate}
        />;
      default:
        return <Dashboard 
          transactions={transactions} 
          loading={loading} 
          currencySymbol={getCurrencySymbol()}
          isDarkMode={isDarkMode}
        />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="animate-fade-in">
        <Header 
          balance={totalBalance} 
          currencySymbol={getCurrencySymbol()}
          isDarkMode={isDarkMode}
        />
      </div>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl overflow-hidden shadow-lg">
          <nav className="flex flex-wrap border-b border-gray-200">
            {['dashboard', 'budget', 'recurring', 'export', 'settings'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 font-medium text-sm focus:outline-none transition-all duration-200 ${
                  activeTab === tab
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-blue-500 hover:bg-blue-50'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        {/* Mobile: Toggle Form Button */}
        <div className="lg:hidden">
          <button
            onClick={() => setFormVisible(!formVisible)}
            className="w-full flex items-center justify-center shadow-lg px-5 py-3 
              bg-gradient-to-r from-blue-600 to-blue-500 text-white
              rounded-xl transition duration-200 hover:from-blue-700 hover:to-blue-600"
          >
            {formVisible ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Hide Form
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add Transaction
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Sidebar - Form & Transactions List (always visible on desktop) */}
          <div className={`lg:col-span-4 space-y-8 animate-slide-in ${formVisible || window.innerWidth >= 1024 ? 'block' : 'hidden'}`}>
            <div className="p-6 rounded-xl shadow-lg bg-white border border-gray-100">
              <TransactionForm 
                onAddTransaction={handleAddTransaction} 
                currencySymbol={getCurrencySymbol()}
                categories={appSettings.categories}
                isDarkMode={isDarkMode}
              />
            </div>
            <div className="p-6 rounded-xl shadow-lg bg-white border border-gray-100">
              <TransactionList
                transactions={transactions}
                onDeleteTransaction={handleDeleteTransaction}
                loading={loading}
                currencySymbol={getCurrencySymbol()}
                isDarkMode={isDarkMode}
              />
            </div>
          </div>

          {/* Main Content - Active Tab Content */}
          <div className="lg:col-span-8 animate-fade-in">
            {renderActiveTabContent()}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t mt-auto bg-white border-gray-200 text-gray-600">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">Personal Budget Visualizer &copy; {new Date().getFullYear()}</p>
          <p className="text-xs mt-2 text-gray-500">Track your finances with ease</p>
        </div>
      </footer>

      {/* Toast Container */}
      <ToastContainer 
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
}

export default App;