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

export const getAllTransactions = async () => {
  try {
    const response = await api.get('/api/transactions');
    console.log('Get Transactions Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get Transactions Error:', error);
    throw error;
  }
};

export const addTransaction = async (transaction) => {
  try {
    const response = await api.post('/api/transactions', transaction);
    console.log('Add Transaction Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Add Transaction Error:', error);
    throw error;
  }
};

export const deleteTransaction = async (id) => {
  try {
    const response = await api.delete(`/api/transactions/${id}`);
    console.log('Delete Transaction Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Delete Transaction Error:', error);
    throw error;
  }
};