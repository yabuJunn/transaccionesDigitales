import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { getBankTransactions, exportBankTransactionsCSV } from '../services/api';
import { Transaction } from '../types';
import BankDashboardContent from '../components/AdminDashboard/BankDashboardContent';
import { useNavigate } from 'react-router-dom';

interface BankFilters {
  from?: string;
  to?: string;
  senderName?: string;
  receiverName?: string;
  status?: string;
  minAmount?: string;
  maxAmount?: string;
}

const AdminBankDashboard = () => {
  const { t } = useTranslation();
  const { user, getIdToken } = useAuth();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<BankFilters>({});
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 1 });

  const fetchTransactions = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const token = await getIdToken();
      if (!token) {
        console.error('No token available');
        return;
      }

      const params: any = { page, limit: 20, ...filters };
      const response = await getBankTransactions(token, params);
      setTransactions(response.data);
      setPagination(response.pagination);
      setTotalPages(response.pagination.totalPages);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [page, user]);

  const handleFilterChange = (key: keyof BankFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value || undefined }));
  };

  const handleApplyFilters = () => {
    setPage(1);
    fetchTransactions();
  };

  const handleClearFilters = () => {
    setFilters({});
    setPage(1);
    setTimeout(() => fetchTransactions(), 100);
  };

  const handleExportCSV = async () => {
    if (!user) return;

    try {
      const token = await getIdToken();
      if (!token) {
        console.error('No token available');
        return;
      }
      await exportBankTransactionsCSV(token, filters);
    } catch (error) {
      console.error('Error exporting CSV:', error);
    }
  };

  return (
    <BankDashboardContent
      t={t}
      transactions={transactions}
      loading={loading}
      filters={filters}
      pagination={pagination}
      page={page}
      totalPages={totalPages}
      onFilterChange={handleFilterChange}
      onApplyFilters={handleApplyFilters}
      onClearFilters={handleClearFilters}
      onExportCSV={handleExportCSV}
      onPageChange={setPage}
    />
  );
};

export default AdminBankDashboard;

