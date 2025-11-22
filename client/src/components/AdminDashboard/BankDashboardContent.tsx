import { Transaction } from '../../types';
import LanguageSwitcher from '../LandingPage/LanguageSwitcher';
import { TFunction } from 'i18next';

interface BankFilters {
  from?: string;
  to?: string;
  senderName?: string;
  receiverName?: string;
  status?: string;
  minAmount?: string;
  maxAmount?: string;
}

interface BankDashboardContentProps {
  t: TFunction;
  transactions: Transaction[];
  loading: boolean;
  filters: BankFilters;
  pagination: { page: number; limit: number; total: number; totalPages: number };
  page: number;
  totalPages: number;
  onFilterChange: (key: keyof BankFilters, value: string) => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
  onExportCSV: () => void;
  onPageChange: (page: number) => void;
}

const BankDashboardContent = ({
  t,
  transactions,
  loading,
  filters,
  pagination,
  page,
  totalPages,
  onFilterChange,
  onApplyFilters,
  onClearFilters,
  onExportCSV,
  onPageChange,
}: BankDashboardContentProps) => {
  const formatAmount = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const formatDate = (date: any) => {
    if (!date) return '';
    if (date.seconds) {
      return new Date(date.seconds * 1000).toLocaleDateString();
    }
    if (date instanceof Date) {
      return date.toLocaleDateString();
    }
    return String(date);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl font-bold text-gray-900">{t('bank.title')}</h1>
            <a
              href="/"
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              ← Volver al inicio
            </a>
          </div>
          <LanguageSwitcher />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">{t('bank.filters')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('bank.dateFrom')}
              </label>
              <input
                type="date"
                value={filters.from || ''}
                onChange={(e) => onFilterChange('from', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('bank.dateTo')}
              </label>
              <input
                type="date"
                value={filters.to || ''}
                onChange={(e) => onFilterChange('to', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('bank.senderName')}
              </label>
              <input
                type="text"
                value={filters.senderName || ''}
                onChange={(e) => onFilterChange('senderName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('bank.receiverName')}
              </label>
              <input
                type="text"
                value={filters.receiverName || ''}
                onChange={(e) => onFilterChange('receiverName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('bank.status')}
              </label>
              <select
                value={filters.status || ''}
                onChange={(e) => onFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">All</option>
                <option value="PENDING">PENDING</option>
                <option value="PAID">PAID</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('bank.minAmount')}
              </label>
              <input
                type="number"
                step="0.01"
                value={filters.minAmount || ''}
                onChange={(e) => onFilterChange('minAmount', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('bank.maxAmount')}
              </label>
              <input
                type="number"
                step="0.01"
                value={filters.maxAmount || ''}
                onChange={(e) => onFilterChange('maxAmount', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
          <div className="flex gap-4 mt-4">
            <button
              onClick={onApplyFilters}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {t('bank.applyFilters')}
            </button>
            <button
              onClick={onClearFilters}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              {t('bank.clearFilters')}
            </button>
            <button
              onClick={onExportCSV}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              {t('bank.exportCSV')}
            </button>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">{t('common.loading')}</div>
          ) : transactions.length === 0 ? (
            <div className="p-8 text-center text-gray-500">{t('bank.noTransactions')}</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('bank.date')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('bank.invoiceNumber')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('bank.sender')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('bank.receiver')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('bank.amount')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('bank.fee')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('bank.paymentMode')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('bank.status')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('bank.receipt')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {transactions.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(transaction.invoiceDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {transaction.invoiceNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {transaction.sender?.fullName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {transaction.receiver?.fullName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatAmount(transaction.amountSent)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatAmount(transaction.fee)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {transaction.paymentMode}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              transaction.invoiceStatus === 'PAID'
                                ? 'bg-green-100 text-green-800'
                                : transaction.invoiceStatus === 'PENDING'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {transaction.invoiceStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {transaction.receiptUrl ? (
                            <a
                              href={transaction.receiptUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800"
                            >
                              {t('bank.viewReceipt')}
                            </a>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200">
                  <div className="text-sm text-gray-700">
                    Showing {((page - 1) * pagination.limit) + 1} to {Math.min(page * pagination.limit, pagination.total)} of {pagination.total} results
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onPageChange(Math.max(1, page - 1))}
                      disabled={page === 1}
                      className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => onPageChange(Math.min(totalPages, page + 1))}
                      disabled={page === totalPages}
                      className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BankDashboardContent;

