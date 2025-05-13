import axios from 'axios';

const baseURL = process.env.NODE_ENV === 'production' 
  ? 'https://finance-budget-backend.onrender.com'
  : 'http://localhost:5000';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const getAllTransactions = async () => {
  try {
    const response = await api.get('/api/transactions');
    console.log('API Response:', response);
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const addTransaction = async (transaction) => {
  try {
    const response = await api.post('/api/transactions', transaction);
    console.log('Add Transaction Response:', response);
    return response.data;
  } catch (error) {
    console.error('Add Transaction Error:', error);
    throw error;
  }
};

export const deleteTransaction = async (id) => {
  try {
    const response = await api.delete(`/api/transactions/${id}`);
    console.log('Delete Transaction Response:', response);
    return response.data;
  } catch (error) {
    console.error('Delete Transaction Error:', error);
    throw error;
  }
};