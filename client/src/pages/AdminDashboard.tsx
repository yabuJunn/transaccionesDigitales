import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getTransactions } from '../services/api';
import { Transaction, TransactionsResponse } from '../types';
import TransactionList from '../components/AdminDashboard/TransactionList';
import TransactionDetails from '../components/AdminDashboard/TransactionDetails';
import DashboardHeader from '../components/AdminDashboard/DashboardHeader';
import DashboardFilters from '../components/AdminDashboard/DashboardFilters';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { user, logout, getIdToken } = useAuth();
  const navigate = useNavigate();
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
    navigate('/admin/login');
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
      <DashboardHeader user={user} onLogout={handleLogout} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        <DashboardFilters
          statusFilter={statusFilter}
          onStatusFilterChange={(value) => {
            setStatusFilter(value);
            setPage(1);
          }}
          totalTransactions={pagination.total}
        />

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

export default AdminDashboard;

