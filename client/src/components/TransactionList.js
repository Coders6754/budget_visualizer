import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TransactionList = ({ transactions, onDeleteTransaction, loading }) => {
  // Add safety check
  const safeTransactions = Array.isArray(transactions) ? transactions : [];
  
  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800">Recent Transactions</h2>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800">Recent Transactions</h2>
      </div>
      
      {safeTransactions.length === 0 ? (
        <div className="text-center py-12 px-6">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p className="text-gray-500">No transactions yet</p>
          <p className="text-sm text-gray-400 mt-1">Add your first transaction to get started</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-50">
          <AnimatePresence>
            {safeTransactions.map((transaction) => (
              <motion.div
                key={transaction._id || Math.random().toString()}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="group"
              >
                <div className="p-4 hover:bg-gray-50 transition-colors duration-150">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction && transaction.amount >= 0 ? 'bg-green-50' : 'bg-red-50'
                      }`}>
                        <svg 
                          className={`w-5 h-5 ${transaction && transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          {transaction && transaction.amount >= 0 ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 12H4" />
                          )}
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{transaction && transaction.description}</h3>
                        <div className="flex items-center space-x-2 mt-0.5">
                          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                            {transaction && transaction.category}
                          </span>
                          <span className="text-xs text-gray-400">
                            {transaction && transaction.date ? new Date(transaction.date).toLocaleDateString() : ''}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <span className={`font-medium ${
                        transaction && transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction && transaction.amount >= 0 ? '+' : ''}${transaction && typeof transaction.amount === 'number' ? Math.abs(transaction.amount).toFixed(2) : '0.00'}
                      </span>
                      
                      <button
                        onClick={() => transaction && transaction._id && onDeleteTransaction(transaction._id)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200"
                        title="Delete transaction"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default TransactionList;