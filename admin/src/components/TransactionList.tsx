import { Transaction, TransactionsResponse } from '../types';

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
  const formatAmount = (cents: number): string => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const formatDate = (date: string | { seconds: number; nanoseconds: number }): string => {
    if (typeof date === 'string') return date;
    return new Date(date.seconds * 1000).toLocaleDateString('es-ES');
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center text-gray-600">Cargando transacciones...</div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center text-gray-600">No hay transacciones disponibles</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Lista de Transacciones</h2>
      </div>
      <div className="divide-y divide-gray-200">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            onClick={() => onSelectTransaction(transaction)}
            className={`px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors ${
              selectedId === transaction.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-gray-900">
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
                <div className="mt-1 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">De:</span> {transaction.sender.fullName}
                  </div>
                  <div>
                    <span className="font-medium">Para:</span> {transaction.receiver.fullName}
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  Fecha: {formatDate(transaction.invoiceDate)}
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-gray-900">
                  {formatAmount(transaction.amountSent)}
                </div>
                <div className="text-sm text-gray-500">
                  Tarifa: {formatAmount(transaction.fee)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Página {pagination.page} de {pagination.totalPages}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            <button
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionList;

