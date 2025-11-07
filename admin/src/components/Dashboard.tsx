import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getTransactions } from '../services/api';
import { Transaction, TransactionsResponse } from '../types';
import TransactionList from './TransactionList';
import TransactionDetails from './TransactionDetails';

const Dashboard = () => {
  const { user, logout, getIdToken } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [statusFilter, setStatusFilter] = useState<string>('');

  const loadTransactions = async () => {
    try {
      setLoading(true);
      setError('');
      const token = await getIdToken();
      if (!token) {
        setError('No se pudo obtener el token de autenticación');
        return;
      }

      const response: TransactionsResponse = await getTransactions(
        token,
        page,
        pagination.limit,
        statusFilter || undefined
      );

      setTransactions(response.data);
      setPagination(response.pagination);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al cargar las transacciones');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, statusFilter]);

  const handleLogout = async () => {
    await logout();
  };

  const formatDate = (date: string | { seconds: number; nanoseconds: number }): string => {
    if (typeof date === 'string') return date;
    return new Date(date.seconds * 1000).toLocaleDateString('es-ES');
  };

  const formatAmount = (cents: number): string => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard de Transacciones</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{user?.email}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        {/* Filters */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filtrar por Estado
              </label>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos</option>
                <option value="PENDING">PENDING</option>
                <option value="PAID">PAID</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>
            <div className="text-sm text-gray-600">
              Total: {pagination.total} transacciones
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Transaction List */}
          <div className="lg:col-span-2">
            <TransactionList
              transactions={transactions}
              loading={loading}
              onSelectTransaction={setSelectedTransaction}
              selectedId={selectedTransaction?.id}
              pagination={pagination}
              onPageChange={setPage}
            />
          </div>

          {/* Transaction Details */}
          <div className="lg:col-span-1">
            {selectedTransaction ? (
              <TransactionDetails
                transaction={selectedTransaction}
                formatDate={formatDate}
                formatAmount={formatAmount}
              />
            ) : (
              <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
                Seleccione una transacción para ver los detalles
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

