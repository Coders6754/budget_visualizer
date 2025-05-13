import React, { useMemo } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title, Filler } from 'chart.js';
import { Pie, Line } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title, Filler);

const Dashboard = ({ transactions, loading }) => {
  const pieChartData = useMemo(() => {
    if (!Array.isArray(transactions) || transactions.length === 0) {
      return {
        income: { labels: [], datasets: [{ data: [], backgroundColor: [], borderWidth: 1 }] },
        expense: { labels: [], datasets: [{ data: [], backgroundColor: [], borderWidth: 1 }] }
      };
    }

    // Income Categories
    const incomeData = transactions
      .filter(t => t && typeof t.amount === 'number' && t.amount > 0)
      .reduce((acc, t) => {
        if (t.category) {
          acc[t.category] = (acc[t.category] || 0) + t.amount;
        }
        return acc;
      }, {});

    // Expense Categories
    const expenseData = transactions
      .filter(t => t && typeof t.amount === 'number' && t.amount < 0)
      .reduce((acc, t) => {
        if (t.category) {
          acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount);
        }
        return acc;
      }, {});

    return {
      income: {
        labels: Object.keys(incomeData),
        datasets: [
          {
            data: Object.values(incomeData),
            backgroundColor: [
              '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722'
            ],
            borderWidth: 1,
          },
        ],
      },
      expense: {
        labels: Object.keys(expenseData),
        datasets: [
          {
            data: Object.values(expenseData),
            backgroundColor: [
              '#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4'
            ],
            borderWidth: 1,
          },
        ],
      }
    };
  }, [transactions]);

  const trendData = useMemo(() => {
    if (!Array.isArray(transactions) || transactions.length === 0) return null;

    // Get last 30 days
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);

    // Filter transactions from last 30 days
    const recentTransactions = transactions
      .filter(t => t && t.date && 
        new Date(t.date) >= thirtyDaysAgo && 
        new Date(t.date) <= today
      );

    // Group by date
    const dailyData = recentTransactions.reduce((acc, t) => {
      if (!t || !t.date) return acc;
      
      const date = new Date(t.date).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = { income: 0, expense: 0 };
      }
      if (t.amount > 0) {
        acc[date].income += t.amount;
      } else {
        acc[date].expense += Math.abs(t.amount);
      }
      return acc;
    }, {});

    // Sort by date
    const sortedDates = Object.keys(dailyData).sort((a, b) => new Date(a) - new Date(b));

    return {
      labels: sortedDates,
      datasets: [
        {
          label: 'Income',
          data: sortedDates.map(date => dailyData[date].income),
          borderColor: '#4caf50',
          backgroundColor: 'rgba(76, 175, 80, 0.1)',
          tension: 0.2,
        },
        {
          label: 'Expense',
          data: sortedDates.map(date => dailyData[date].expense),
          borderColor: '#f44336',
          backgroundColor: 'rgba(244, 67, 54, 0.1)',
          tension: 0.2,
        }
      ]
    };
  }, [transactions]);

  const summary = useMemo(() => {
    if (!Array.isArray(transactions) || transactions.length === 0) {
      return { income: 0, expense: 0, balance: 0 };
    }

    const income = transactions
      .filter(t => t && typeof t.amount === 'number' && t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);
      
    const expense = transactions
      .filter(t => t && typeof t.amount === 'number' && t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
      
    return {
      income,
      expense,
      balance: income - expense
    };
  }, [transactions]);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-6">Dashboard</h2>
        <p className="text-gray-500">Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-6">Dashboard</h2>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-green-600 font-medium">Total Income</p>
          <p className="text-2xl font-bold text-green-700">${summary.income.toFixed(2)}</p>
        </div>
        
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-sm text-red-600 font-medium">Total Expenses</p>
          <p className="text-2xl font-bold text-red-700">${summary.expense.toFixed(2)}</p>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-600 font-medium">Balance</p>
          <p className="text-2xl font-bold text-blue-700">${summary.balance.toFixed(2)}</p>
        </div>
      </div>
      
      {transactions.length === 0 ? (
        <p className="text-gray-500 text-center my-8">Add transactions to see your financial insights!</p>
      ) : (
        <>
          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Income Pie Chart */}
            <div>
              <h3 className="text-lg font-medium mb-3">Income Breakdown</h3>
              {pieChartData && pieChartData.income.labels.length > 0 ? (
                <div className="h-64">
                  <Pie data={pieChartData.income} options={{ maintainAspectRatio: false }} />
                </div>
              ) : (
                <p className="text-gray-500 text-center my-8">No income data available</p>
              )}
            </div>
            
            {/* Expense Pie Chart */}
            <div>
              <h3 className="text-lg font-medium mb-3">Expense Breakdown</h3>
              {pieChartData && pieChartData.expense.labels.length > 0 ? (
                <div className="h-64">
                  <Pie data={pieChartData.expense} options={{ maintainAspectRatio: false }} />
                </div>
              ) : (
                <p className="text-gray-500 text-center my-8">No expense data available</p>
              )}
            </div>
          </div>
          
          {/* Trend Chart */}
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-3">30-Day Trend</h3>
            {trendData && trendData.labels.length > 0 ? (
              <div className="h-64">
                <Line 
                  data={trendData} 
                  options={{ 
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true
                      }
                    }
                  }} 
                />
              </div>
            ) : (
              <p className="text-gray-500 text-center my-8">Not enough data for trend analysis</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;