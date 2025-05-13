import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://testing-2j7e.vercel.app/api/transactions';

export const getAllTransactions = async () => {
  const response = await axios.get(API_URL);
  // Check if the data is properly formatted, and extract the transactions array
  if (response.data && response.data.data) {
    return response.data.data; 
  } else if (Array.isArray(response.data)) {
    return response.data; 
  } else {
    return []; 
  }
};

export const addTransaction = async (transaction) => {
  const response = await axios.post(API_URL, transaction);
  // Return the transaction data correctly
  return response.data.data || response.data;
};

export const deleteTransaction = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};