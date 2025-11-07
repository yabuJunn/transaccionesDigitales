import axios from 'axios';
import { TransactionInput } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const submitTransaction = async (data: TransactionInput) => {
  const response = await api.post('/api/transactions', data);
  return response.data;
};

