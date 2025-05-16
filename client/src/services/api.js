import axios from 'axios';

const baseURL = process.env.NODE_ENV === 'production' 
  ? 'https://finance-budget-backend.onrender.com'
  : 'http://localhost:5000';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true // Enable credentials
});

// Add request interceptor for debugging
api.interceptors.request.use(request => {
  console.log('Starting Request:', request);
  return request;
});

// Add response interceptor for debugging
api.interceptors.response.use(
  response => {
    console.log('Response:', response);
    // Normalize the response data
    if (response.data && response.data.data) {
      return { ...response, data: response.data.data };
    }
    return response;
  },
  error => {
    console.error('API Error Details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    return Promise.reject(error);
  }
);

// Transactions API endpoints
export const getAllTransactions = async () => {
  try {
    const response = await api.get('/api/transactions');
    // Return the normalized data
    return response.data;
  } catch (error) {
    console.error('Get Transactions Error:', error);
    throw error;
  }
};

export const addTransaction = async (transaction) => {
  try {
    const response = await api.post('/api/transactions', transaction);
    // Return the normalized data
    return response.data;
  } catch (error) {
    console.error('Add Transaction Error:', error);
    throw error;
  }
};

export const deleteTransaction = async (id) => {
  try {
    const response = await api.delete(`/api/transactions/${id}`);
    // Return the normalized data
    return response.data;
  } catch (error) {
    console.error('Delete Transaction Error:', error);
    throw error;
  }
};

// Budget API endpoints
export const getBudgets = async () => {
  try {
    const response = await api.get('/api/budgets');
    return response.data;
  } catch (error) {
    console.error('Get Budgets Error:', error);
    throw error;
  }
};

export const addBudget = async (budget) => {
  try {
    const response = await api.post('/api/budgets', budget);
    return response.data;
  } catch (error) {
    console.error('Add Budget Error:', error);
    throw error;
  }
};

export const updateBudget = async (id, budget) => {
  try {
    const response = await api.put(`/api/budgets/${id}`, budget);
    return response.data;
  } catch (error) {
    console.error('Update Budget Error:', error);
    throw error;
  }
};

export const deleteBudget = async (id) => {
  try {
    const response = await api.delete(`/api/budgets/${id}`);
    return response.data;
  } catch (error) {
    console.error('Delete Budget Error:', error);
    throw error;
  }
};

// Recurring Transaction API endpoints
export const getRecurringTransactions = async () => {
  try {
    const response = await api.get('/api/recurring');
    return response.data;
  } catch (error) {
    console.error('Get Recurring Transactions Error:', error);
    throw error;
  }
};

export const addRecurringTransaction = async (transaction) => {
  try {
    const response = await api.post('/api/recurring', transaction);
    return response.data;
  } catch (error) {
    console.error('Add Recurring Transaction Error:', error);
    throw error;
  }
};

export const updateRecurringTransaction = async (id, transaction) => {
  try {
    const response = await api.put(`/api/recurring/${id}`, transaction);
    return response.data;
  } catch (error) {
    console.error('Update Recurring Transaction Error:', error);
    throw error;
  }
};

export const deleteRecurringTransaction = async (id) => {
  try {
    const response = await api.delete(`/api/recurring/${id}`);
    return response.data;
  } catch (error) {
    console.error('Delete Recurring Transaction Error:', error);
    throw error;
  }
};

export const processRecurringTransactions = async () => {
  try {
    const response = await api.post('/api/recurring/process');
    return response.data;
  } catch (error) {
    console.error('Process Recurring Transactions Error:', error);
    throw error;
  }
};