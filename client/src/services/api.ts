import axios from 'axios';
import { TransactionInput, TransactionsResponse, Transaction } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Public endpoint - submit transaction
export const submitTransaction = async (data: TransactionInput) => {
  const response = await api.post('/api/transactions', data);
  return response.data;
};

// Admin endpoints - require authentication
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

// Bank endpoints - require bank/admin authentication
export const getBankTransactions = async (token: string, params: Record<string, any>): Promise<TransactionsResponse> => {
  const response = await api.get<TransactionsResponse>('/api/bank/transactions', {
    params,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const exportBankTransactionsCSV = async (token: string, filters: Record<string, any>) => {
  const params = { ...filters, export: 'csv' };
  const response = await api.get('/api/bank/transactions', {
    params,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    responseType: 'blob',
  });
  
  // Create download link
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `transactions_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

