interface DashboardFiltersProps {
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  totalTransactions: number;
}

const DashboardFilters = ({
  statusFilter,
  onStatusFilterChange,
  totalTransactions,
}: DashboardFiltersProps) => {
  return (
    <div className="mb-6 bg-white p-4 rounded-lg shadow">
      <div className="flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Filtrar por Estado
          </label>
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos</option>
            <option value="PENDING">PENDING</option>
            <option value="PAID">PAID</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </div>
        <div className="text-sm text-gray-600">
          Total: {totalTransactions} transacciones
        </div>
      </div>
    </div>
  );
};

export default DashboardFilters;

