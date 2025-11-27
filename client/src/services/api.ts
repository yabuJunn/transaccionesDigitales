import axios from 'axios';
import { TransactionInput, TransactionsResponse, Transaction } from '../types';

// Cloud Function URL - Change this if you change region or project
export const API_URL = 'https://us-central1-transaccionesvirtuales-1878f.cloudfunctions.net/api';

// Always use the Cloud Function URL - no localhost option
// Only use VITE_API_URL if it's explicitly set AND doesn't contain localhost
// This ensures production always uses Firebase Functions
const getApiBaseUrl = (): string => {
  const viteApiUrl = import.meta.env.VITE_API_URL;
  
  // Ignore VITE_API_URL if it contains localhost (prevents old config from breaking production)
  if (viteApiUrl && !viteApiUrl.includes('localhost') && !viteApiUrl.includes('127.0.0.1')) {
    return viteApiUrl;
  }
  
  // Always use production Cloud Function URL
  return API_URL;
};

const API_BASE_URL = getApiBaseUrl();

// Debug logging
if (typeof window !== 'undefined') {
  console.log('🔧 API Configuration:', {
    baseURL: API_BASE_URL,
    API_URL,
    hostname: window.location.hostname,
    PROD: import.meta.env.PROD,
    MODE: import.meta.env.MODE,
    VITE_API_URL: import.meta.env.VITE_API_URL
  });
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Public endpoint - submit transaction
export const submitTransaction = async (data: TransactionInput) => {
  const response = await api.post('/transactions', data);
  return response.data;
};

// Admin endpoints - require authentication
export const getTransactions = async (token: string, page = 1, limit = 20, status?: string): Promise<TransactionsResponse> => {
  const params: Record<string, string | number> = { page, limit };
  if (status) params.status = status;

  const response = await api.get<TransactionsResponse>('/transactions', {
    params,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getTransaction = async (id: string, token: string): Promise<{ success: boolean; data: Transaction }> => {
  const response = await api.get(`/transactions/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Bank endpoints - require bank/admin authentication
export const getBankTransactions = async (token: string, params: Record<string, any>): Promise<TransactionsResponse> => {
  const response = await api.get<TransactionsResponse>('/bank/transactions', {
    params,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const exportBankTransactionsCSV = async (token: string, filters: Record<string, any>) => {
  const params = { ...filters, export: 'csv' };
  const response = await api.get('/bank/transactions', {
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

