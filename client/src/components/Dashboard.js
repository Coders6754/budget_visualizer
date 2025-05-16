import React, { useMemo } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title, Filler } from 'chart.js';
import { Pie, Line } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title, Filler);

const Dashboard = ({ transactions, loading, currencySymbol = '$', isDarkMode = false }) => {
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
              '#4ade80', '#34d399', '#2dd4bf', '#22d3ee', '#38bdf8', '#60a5fa', '#818cf8', '#a78bfa'
            ],
            borderColor: '#ffffff',
            borderWidth: 2,
          },
        ],
      },
      expense: {
        labels: Object.keys(expenseData),
        datasets: [
          {
            data: Object.values(expenseData),
            backgroundColor: [
              '#f87171', '#fb7185', '#f472b6', '#e879f9', '#c084fc', '#a78bfa', '#818cf8', '#60a5fa'
            ],
            borderColor: '#ffffff',
            borderWidth: 2,
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
          borderColor: '#4ade80',
          backgroundColor: 'rgba(74, 222, 128, 0.1)',
          fill: true,
          tension: 0.4,
          borderWidth: 3,
          pointRadius: 4,
          pointBackgroundColor: '#4ade80',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
        },
        {
          label: 'Expense',
          data: sortedDates.map(date => dailyData[date].expense),
          borderColor: '#f87171',
          backgroundColor: 'rgba(248, 113, 113, 0.1)',
          fill: true,
          tension: 0.4,
          borderWidth: 3,
          pointRadius: 4,
          pointBackgroundColor: '#f87171',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
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

  const chartOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          font: {
            family: 'Inter, sans-serif',
            size: 12
          },
          usePointStyle: true,
          padding: 20,
          color: '#64748b'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#0f172a',
        bodyColor: '#334155',
        borderColor: '#e2e8f0',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        boxPadding: 4,
        usePointStyle: true,
        callbacks: {
          label: function(context) {
            return `${context.label}: ${currencySymbol}${context.raw.toFixed(2)}`;
          }
        }
      }
    }
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            family: 'Inter, sans-serif',
            size: 12
          },
          usePointStyle: true,
          padding: 20,
          color: '#64748b'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#0f172a',
        bodyColor: '#334155',
        borderColor: '#e2e8f0',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        boxPadding: 4,
        usePointStyle: true,
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${currencySymbol}${context.parsed.y.toFixed(2)}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(226, 232, 240, 0.5)',
          drawBorder: false
        },
        ticks: {
          font: {
            family: 'Inter, sans-serif',
            size: 11
          },
          color: '#64748b',
          padding: 10,
          callback: function(value) {
            return currencySymbol + value.toLocaleString();
          }
        }
      },
      x: {
        grid: {
          display: false,
          drawBorder: false
        },
        ticks: {
          font: {
            family: 'Inter, sans-serif',
            size: 11
          },
          color: '#64748b',
          padding: 10,
          maxRotation: 45,
          minRotation: 45
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <h2 className="text-xl font-semibold mb-6 text-gray-800">Dashboard</h2>
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-16 w-16 bg-blue-100 rounded-full mb-4"></div>
            <div className="h-4 w-40 bg-gray-100 rounded mb-2"></div>
            <div className="h-3 w-32 bg-gray-100 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">Dashboard</h2>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl shadow border border-green-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Total Income</p>
              <p className="text-2xl font-bold text-green-700 mt-1">
                {currencySymbol}{summary.income.toFixed(2)}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-red-50 to-rose-50 p-6 rounded-xl shadow border border-red-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600 font-medium">Total Expenses</p>
              <p className="text-2xl font-bold text-red-700 mt-1">
                {currencySymbol}{summary.expense.toFixed(2)}
              </p>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl shadow border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Balance</p>
              <p className="text-2xl font-bold text-blue-700 mt-1">
                {currencySymbol}{summary.balance.toFixed(2)}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      {transactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center bg-gray-50 rounded-xl p-10 mt-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-gray-500 text-lg font-medium mb-2">No transactions yet</p>
          <p className="text-gray-400 text-center">Add transactions to see your financial insights!</p>
        </div>
      ) : (
        <>
          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Income Pie Chart */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <h3 className="text-lg font-medium mb-4 text-gray-800">Income Breakdown</h3>
              {pieChartData && pieChartData.income.labels.length > 0 ? (
                <div className="h-72">
                  <Pie data={pieChartData.income} options={chartOptions} />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center bg-gray-50 rounded-xl p-10 h-72">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4v16m8-8H4" />
                  </svg>
                  <p className="text-gray-400 text-center">No income data available</p>
                </div>
              )}
            </div>
            
            {/* Expense Pie Chart */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <h3 className="text-lg font-medium mb-4 text-gray-800">Expense Breakdown</h3>
              {pieChartData && pieChartData.expense.labels.length > 0 ? (
                <div className="h-72">
                  <Pie data={pieChartData.expense} options={chartOptions} />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center bg-gray-50 rounded-xl p-10 h-72">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M18 12H6" />
                  </svg>
                  <p className="text-gray-400 text-center">No expense data available</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Trend Chart */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 mt-8">
            <h3 className="text-lg font-medium mb-4 text-gray-800">30-Day Financial Trend</h3>
            {trendData && trendData.labels.length > 0 ? (
              <div className="h-80">
                <Line 
                  data={trendData} 
                  options={lineChartOptions} 
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center bg-gray-50 rounded-xl p-10 h-80">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
                <p className="text-gray-400 text-center">Not enough data for trend analysis</p>
                <p className="text-gray-400 text-sm text-center mt-2">Add more transactions over time to see the trend</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;