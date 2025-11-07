import axios from 'axios';
import { TransactionsResponse, Transaction } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getTransactions = async (token: string, page = 1, limit = 20, status?: string): Promise<TransactionsResponse> => {
  const params: Record<string, string | number> = { page, limit };
  if (status) params.status = status;
  
  const response = await api.get<TransactionsResponse>('/api/transactions', {
    params,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getTransaction = async (id: string, token: string): Promise<{ success: boolean; data: Transaction }> => {
  const response = await api.get(`/api/transactions/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

