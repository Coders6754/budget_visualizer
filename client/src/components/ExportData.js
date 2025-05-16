import React, { useState } from 'react';
import { toast } from 'react-toastify';

const ExportData = ({ transactions }) => {
  const [exportFormat, setExportFormat] = useState('csv');
  const [dateRange, setDateRange] = useState('all');
  const [customRange, setCustomRange] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().slice(0, 10),
    endDate: new Date().toISOString().slice(0, 10)
  });

  const handleExport = () => {
    if (!Array.isArray(transactions) || transactions.length === 0) {
      toast.error('No transactions to export');
      return;
    }

    // Filter transactions by date if needed
    let filteredTransactions = [...transactions];
    
    if (dateRange !== 'all') {
      const today = new Date();
      let startDate;
      
      switch (dateRange) {
        case 'thisMonth':
          startDate = new Date(today.getFullYear(), today.getMonth(), 1);
          break;
        case 'lastMonth':
          startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
          const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
          filteredTransactions = transactions.filter(t => {
            const transactionDate = new Date(t.date);
            return transactionDate >= startDate && transactionDate <= endOfLastMonth;
          });
          return;
        case 'last3Months':
          startDate = new Date(today.getFullYear(), today.getMonth() - 3, 1);
          break;
        case 'thisYear':
          startDate = new Date(today.getFullYear(), 0, 1);
          break;
        case 'custom':
          startDate = new Date(customRange.startDate);
          const endDate = new Date(customRange.endDate);
          endDate.setHours(23, 59, 59, 999); // End of day
          
          filteredTransactions = transactions.filter(t => {
            const transactionDate = new Date(t.date);
            return transactionDate >= startDate && transactionDate <= endDate;
          });
          break;
        default:
          startDate = new Date(0); // Beginning of time
      }
      
      if (dateRange !== 'custom' && dateRange !== 'lastMonth') {
        filteredTransactions = transactions.filter(t => {
          const transactionDate = new Date(t.date);
          return transactionDate >= startDate && transactionDate <= today;
        });
      }
    }

    // Generate export data based on format
    let dataStr;
    let fileName;
    
    switch (exportFormat) {
      case 'csv':
        dataStr = generateCSV(filteredTransactions);
        fileName = `budget_data_${new Date().toISOString().slice(0, 10)}.csv`;
        break;
      case 'json':
        dataStr = JSON.stringify(filteredTransactions, null, 2);
        fileName = `budget_data_${new Date().toISOString().slice(0, 10)}.json`;
        break;
      case 'pdf':
        toast.info('PDF export is coming soon!');
        return;
      default:
        dataStr = generateCSV(filteredTransactions);
        fileName = `budget_data_${new Date().toISOString().slice(0, 10)}.csv`;
    }

    // Create download link
    const downloadLink = document.createElement('a');
    const universalBOM = '\uFEFF'; // BOM for UTF-8
    
    if (exportFormat === 'json') {
      downloadLink.href = 'data:text/json;charset=utf-8,' + encodeURIComponent(universalBOM + dataStr);
    } else {
      downloadLink.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(universalBOM + dataStr);
    }
    
    downloadLink.download = fileName;
    downloadLink.style.display = 'none';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    
    toast.success(`Data exported as ${fileName}`);
  };

  const generateCSV = (data) => {
    if (!data || data.length === 0) return '';
    
    // CSV Header
    const headers = ['Date', 'Description', 'Category', 'Amount', 'Type'];
    
    // Create CSV rows
    const csvRows = [
      headers.join(','),
      ...data.map(t => {
        const date = new Date(t.date).toLocaleDateString();
        const description = t.description.replace(/,/g, ' '); // Remove commas to avoid CSV issues
        const category = t.category;
        const amount = Math.abs(t.amount).toFixed(2);
        const type = t.amount > 0 ? 'Income' : 'Expense';
        
        return [date, description, category, amount, type].join(',');
      })
    ];
    
    return csvRows.join('\n');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-6">Export Data</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-md font-medium mb-3">Export Format</h3>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="exportFormat"
                value="csv"
                checked={exportFormat === 'csv'}
                onChange={() => setExportFormat('csv')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <span>CSV (Excel, Google Sheets)</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="exportFormat"
                value="json"
                checked={exportFormat === 'json'}
                onChange={() => setExportFormat('json')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <span>JSON (Developer format)</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="exportFormat"
                value="pdf"
                checked={exportFormat === 'pdf'}
                onChange={() => setExportFormat('pdf')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <span>PDF (Coming soon)</span>
            </label>
          </div>
        </div>
        
        <div>
          <h3 className="text-md font-medium mb-3">Date Range</h3>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="dateRange"
                value="all"
                checked={dateRange === 'all'}
                onChange={() => setDateRange('all')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <span>All time</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="dateRange"
                value="thisMonth"
                checked={dateRange === 'thisMonth'}
                onChange={() => setDateRange('thisMonth')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <span>This month</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="dateRange"
                value="lastMonth"
                checked={dateRange === 'lastMonth'}
                onChange={() => setDateRange('lastMonth')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <span>Last month</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="dateRange"
                value="last3Months"
                checked={dateRange === 'last3Months'}
                onChange={() => setDateRange('last3Months')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <span>Last 3 months</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="dateRange"
                value="thisYear"
                checked={dateRange === 'thisYear'}
                onChange={() => setDateRange('thisYear')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <span>This year</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="dateRange"
                value="custom"
                checked={dateRange === 'custom'}
                onChange={() => setDateRange('custom')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <span>Custom range</span>
            </label>
          </div>
        </div>
      </div>
      
      {dateRange === 'custom' && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="text-sm font-medium mb-3">Custom Date Range</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={customRange.startDate}
                onChange={(e) => setCustomRange({...customRange, startDate: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                End Date
              </label>
              <input
                type="date"
                value={customRange.endDate}
                onChange={(e) => setCustomRange({...customRange, endDate: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      )}
      
      <div className="mt-6 flex justify-center">
        <button
          onClick={handleExport}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export {exportFormat.toUpperCase()}
        </button>
      </div>
      
      <div className="mt-4 text-center text-sm text-gray-500">
        <p>Export your transaction data for backup or further analysis.</p>
        {transactions && transactions.length > 0 ? (
          <p className="mt-1">You have {transactions.length} transactions available for export.</p>
        ) : (
          <p className="mt-1">Add transactions to enable export functionality.</p>
        )}
      </div>
    </div>
  );
};

export default ExportData; 