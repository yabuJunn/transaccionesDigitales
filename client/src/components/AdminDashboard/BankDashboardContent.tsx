import { Transaction } from '../../types';
import LanguageSwitcher from '../LandingPage/LanguageSwitcher';
import ThemeToggle from '../ThemeToggle';
import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';

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
  const { i18n } = useTranslation();

  const formatAmount = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const formatDate = (date: any) => {
    if (!date) return '';
    
    // If it's already a string, try to parse it
    if (typeof date === 'string') {
      const parsed = new Date(date);
      if (!isNaN(parsed.getTime())) {
        const locale = i18n.language === 'es' ? 'es-ES' : 'en-US';
        return parsed.toLocaleString(locale, {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        });
      }
      return date;
    }
    
    // If it's a Firestore Timestamp object
    if (date.seconds !== undefined) {
      const locale = i18n.language === 'es' ? 'es-ES' : 'en-US';
      const dateObj = new Date(date.seconds * 1000 + (date.nanoseconds || 0) / 1000000);
      if (isNaN(dateObj.getTime())) {
        return 'Invalid Date';
      }
      return dateObj.toLocaleString(locale, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
    
    // If it's a Date object
    if (date instanceof Date) {
      const locale = i18n.language === 'es' ? 'es-ES' : 'en-US';
      return date.toLocaleString(locale, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
    
    // Fallback: try to convert to string
    return String(date);
  };

  return (
    <div className="min-h-screen bg-neutral-surface">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <img 
              src="/assets/favicon.png" 
              alt="Globan Capital logo" 
              className="h-10"
            />
            <h1 className="text-3xl font-bold text-primary">{t('bank.title')}</h1>
            <a
              href="/"
              className="link-accent text-sm"
            >
              {t('bank.backToHome')}
            </a>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <LanguageSwitcher />
          </div>
        </div>

        {/* Filters */}
        <div className="card-white p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">{t('bank.filters')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-primary mb-1">
                {t('bank.dateFrom')}
              </label>
              <input
                type="date"
                value={filters.from || ''}
                onChange={(e) => onFilterChange('from', e.target.value)}
                className="w-full px-3 py-2 border border-neutral-border bg-neutral-bg text-neutral-text rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-1">
                {t('bank.dateTo')}
              </label>
              <input
                type="date"
                value={filters.to || ''}
                onChange={(e) => onFilterChange('to', e.target.value)}
                className="w-full px-3 py-2 border border-neutral-border bg-neutral-bg text-neutral-text rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-1">
                {t('bank.senderName')}
              </label>
              <input
                type="text"
                value={filters.senderName || ''}
                onChange={(e) => onFilterChange('senderName', e.target.value)}
                className="w-full px-3 py-2 border border-neutral-border bg-neutral-bg text-neutral-text rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-1">
                {t('bank.receiverName')}
              </label>
              <input
                type="text"
                value={filters.receiverName || ''}
                onChange={(e) => onFilterChange('receiverName', e.target.value)}
                className="w-full px-3 py-2 border border-neutral-border bg-neutral-bg text-neutral-text rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-1">
                {t('bank.status')}
              </label>
              <select
                value={filters.status || ''}
                onChange={(e) => onFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-neutral-border bg-neutral-bg text-neutral-text rounded-md"
              >
                <option value="">All</option>
                <option value="PENDING">PENDING</option>
                <option value="PAID">PAID</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-1">
                {t('bank.minAmount')}
              </label>
              <input
                type="number"
                step="0.01"
                value={filters.minAmount || ''}
                onChange={(e) => onFilterChange('minAmount', e.target.value)}
                className="w-full px-3 py-2 border border-neutral-border bg-neutral-bg text-neutral-text rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-1">
                {t('bank.maxAmount')}
              </label>
              <input
                type="number"
                step="0.01"
                value={filters.maxAmount || ''}
                onChange={(e) => onFilterChange('maxAmount', e.target.value)}
                className="w-full px-3 py-2 border border-neutral-border bg-neutral-bg text-neutral-text rounded-md"
              />
            </div>
          </div>
          <div className="flex gap-4 mt-4">
            <button
              onClick={onApplyFilters}
              className="btn-primary"
            >
              {t('bank.applyFilters')}
            </button>
            <button
              onClick={onClearFilters}
              className="px-4 py-2 bg-neutral-surface-alt text-neutral-text rounded-md hover:bg-neutral-surface transition-colors"
            >
              {t('bank.clearFilters')}
            </button>
            <button
              onClick={onExportCSV}
              className="btn-secondary"
            >
              {t('bank.exportCSV')}
            </button>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="card-white overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">{t('common.loading')}</div>
          ) : transactions.length === 0 ? (
            <div className="p-8 text-center text-neutral-muted">{t('bank.noTransactions')}</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-neutral-border">
                  <thead className="bg-neutral-surface-alt">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-muted uppercase tracking-wider">
                        {t('bank.date')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-muted uppercase tracking-wider">
                        {t('bank.invoiceNumber')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-muted uppercase tracking-wider">
                        {t('bank.sender')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-muted uppercase tracking-wider">
                        {t('bank.receiver')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-muted uppercase tracking-wider">
                        {t('bank.amount')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-muted uppercase tracking-wider">
                        {t('bank.fee')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-muted uppercase tracking-wider">
                        {t('bank.paymentMode')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-muted uppercase tracking-wider">
                        {t('bank.status')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-muted uppercase tracking-wider">
                        {t('bank.receipt')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-neutral-bg divide-y divide-neutral-border">
                    {transactions.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-neutral-surface-alt transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-text">
                          {formatDate(transaction.invoiceDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-text">
                          {transaction.invoiceNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-text">
                          {transaction.sender?.fullName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-text">
                          {transaction.receiver?.fullName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-text">
                          {formatAmount(transaction.amountSent)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-text">
                          {formatAmount(transaction.fee)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-text">
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
                              className="link-accent"
                            >
                              {t('bank.viewReceipt')}
                            </a>
                          ) : (
                            <span className="text-neutral-muted-2">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="bg-neutral-surface-alt px-4 py-3 flex items-center justify-between border-t border-neutral-border">
                  <div className="text-sm text-neutral-text">
                    {t('bank.showingResults', {
                      from: ((page - 1) * pagination.limit) + 1,
                      to: Math.min(page * pagination.limit, pagination.total),
                      total: pagination.total
                    })}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onPageChange(Math.max(1, page - 1))}
                      disabled={page === 1}
                      className="px-3 py-1 border border-neutral-border rounded-md disabled:opacity-50 hover:bg-neutral-surface transition-colors"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => onPageChange(Math.min(totalPages, page + 1))}
                      disabled={page === totalPages}
                      className="px-3 py-1 border border-neutral-border rounded-md disabled:opacity-50 hover:bg-neutral-surface transition-colors"
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

