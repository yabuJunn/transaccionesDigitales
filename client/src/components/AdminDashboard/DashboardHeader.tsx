import { User } from 'firebase/auth';
import { useTranslation } from 'react-i18next';
import ThemeToggle from '../ThemeToggle';

interface DashboardHeaderProps {
  user: User | null;
  onLogout: () => void;
}

const DashboardHeader = ({ user, onLogout }: DashboardHeaderProps) => {
  const { t } = useTranslation();

  return (
    <header className="header-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <img 
              src="/assets/favicon.png" 
              alt="165 Group logo" 
              className="h-10"
            />
            <h1 className="text-2xl font-bold text-primary">{t('admin.dashboardTitle')}</h1>
            <a
              href="/"
              className="link-accent text-sm"
            >
              {t('admin.backToHome')}
            </a>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <span className="text-sm text-neutral-muted">{user?.email}</span>
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
            >
              {t('admin.logout')}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;

