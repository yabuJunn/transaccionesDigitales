import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

  return (
    <div className="mb-6 card-white p-4">
      <div className="flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-primary mb-1">
            {t('admin.filterByStatus')}
          </label>
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="w-full px-3 py-2 border border-neutral-border bg-neutral-bg text-neutral-text rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          >
            <option value="">{t('admin.all')}</option>
            <option value="PENDING">PENDING</option>
            <option value="PAID">PAID</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </div>
        <div className="text-sm text-neutral-muted">
          {t('admin.totalTransactions', { count: totalTransactions })}
        </div>
      </div>
    </div>
  );
};

export default DashboardFilters;

