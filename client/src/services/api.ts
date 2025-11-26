import axios from 'axios';
import { TransactionInput, TransactionsResponse, Transaction } from '../types';

// In production (Firebase Hosting), use relative path /api (handled by rewrite)
// In development, use VITE_API_URL or default to localhost:4000
// In emulator, use the emulator URL
const getApiBaseUrl = (): string => {
  // If VITE_API_URL is explicitly set, use it
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // In production (deployed to Firebase Hosting), use relative path
  // Firebase Hosting rewrite will forward /api/** to the Cloud Function
  if (import.meta.env.PROD) {
    return '/api';
  }
  
  // In development, default to local Express server
  return 'http://localhost:4000';
};

const API_BASE_URL = getApiBaseUrl();

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

