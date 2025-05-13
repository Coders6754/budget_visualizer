import React, { useState, useEffect } from 'react';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import { getAllTransactions, addTransaction, deleteTransaction } from './services/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formVisible, setFormVisible] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      
      setLoading(true);
      const data = await getAllTransactions();
      setTransactions(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast.error('Failed to load transactions');
      setLoading(false);
    }
  };

  const handleAddTransaction = async (transaction) => {
    try {
      const newTransaction = await addTransaction(transaction);
      setTransactions([newTransaction, ...transactions]);
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
      setTransactions(transactions.filter(transaction => transaction._id !== id));
      toast.success('Transaction deleted successfully!');
    } catch (error) {
      console.error('Error deleting transaction:', error);
      toast.error('Failed to delete transaction');
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="animate-fade-in">
        <Header balance={totalBalance} />
      </div>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Mobile: Toggle Form Button */}
        <div className="lg:hidden">
          <button
            onClick={() => setFormVisible(!formVisible)}
            className="w-full btn-primary flex items-center justify-center shadow-md"
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar - Form & Transactions List */}
          <div className={`lg:col-span-4 space-y-6 animate-slide-in ${formVisible || window.innerWidth >= 1024 ? 'block' : 'hidden'}`}>
            <div className="card">
              <TransactionForm onAddTransaction={handleAddTransaction} />
            </div>
            <div className="card">
              <TransactionList
                transactions={transactions}
                onDeleteTransaction={handleDeleteTransaction}
                loading={loading}
              />
            </div>
          </div>

          {/* Main Content - Dashboard */}
          <div className="lg:col-span-8 animate-fade-in">
            <div className="card">
              <Dashboard transactions={transactions} loading={loading} />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white py-6 border-t border-gray-200 mt-auto">
        <div className="container mx-auto px-4 text-center text-gray-600">
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