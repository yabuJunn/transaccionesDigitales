import { Transaction } from '../../types';
import { useTranslation } from 'react-i18next';

interface TransactionListProps {
  transactions: Transaction[];
  loading: boolean;
  onSelectTransaction: (transaction: Transaction) => void;
  selectedId?: string;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  onPageChange: (page: number) => void;
}

const TransactionList = ({
  transactions,
  loading,
  onSelectTransaction,
  selectedId,
  pagination,
  onPageChange,
}: TransactionListProps) => {
  const { t, i18n } = useTranslation();

  const formatAmount = (cents: number): string => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const formatDate = (date: string | { seconds: number; nanoseconds?: number } | any): string => {
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

  if (loading) {
    return (
      <div className="card-white p-6">
        <div className="text-center text-neutral-muted">{t('admin.loadingTransactions')}</div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="card-white p-6">
        <div className="text-center text-neutral-muted">{t('admin.noTransactionsAvailable')}</div>
      </div>
    );
  }

  return (
    <div className="card-white">
      <div className="px-6 py-4 border-b border-neutral-border">
        <h2 className="text-lg font-semibold text-primary">{t('admin.transactionList')}</h2>
      </div>
      <div className="divide-y divide-neutral-border">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            onClick={() => onSelectTransaction(transaction)}
            className={`px-6 py-4 cursor-pointer hover:bg-neutral-surface-alt transition-colors ${
              selectedId === transaction.id ? 'bg-secondary-300 dark:bg-secondary-600 border-l-4 border-primary' : ''
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-primary">
                    #{transaction.invoiceNumber}
                  </span>
                  <span
                    className={`px-2 py-1 text-xs rounded ${
                      transaction.invoiceStatus === 'PAID'
                        ? 'bg-green-100 text-green-800'
                        : transaction.invoiceStatus === 'PENDING'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {transaction.invoiceStatus}
                  </span>
                </div>
                <div className="mt-1 text-sm text-neutral-muted">
                  <div>
                    <span className="font-medium">{t('form.sender')}:</span> <span className="text-neutral-text">{transaction.sender.fullName}</span>
                  </div>
                  <div>
                    <span className="font-medium">{t('form.receiver')}:</span> <span className="text-neutral-text">{transaction.receiver.fullName}</span>
                  </div>
                </div>
                <div className="mt-2 text-sm text-neutral-muted-2">
                  {t('bank.date')}: {formatDate(transaction.invoiceDate)}
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-primary">
                  {formatAmount(transaction.amountSent)}
                </div>
                <div className="text-sm text-neutral-muted">
                  {t('admin.fee')}: {formatAmount(transaction.fee)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="px-6 py-4 border-t border-neutral-border flex justify-between items-center">
          <div className="text-sm text-neutral-muted">
            {t('admin.page', { current: pagination.page, total: pagination.totalPages })}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="px-4 py-2 border border-neutral-border rounded-md text-sm font-medium text-neutral-text hover:bg-neutral-surface-alt disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {t('admin.previous')}
            </button>
            <button
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className="px-4 py-2 border border-neutral-border rounded-md text-sm font-medium text-neutral-text hover:bg-neutral-surface-alt disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {t('admin.next')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionList;

