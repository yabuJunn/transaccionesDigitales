import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/LandingPage/LanguageSwitcher';
import ThemeToggle from '../components/ThemeToggle';

const LandingPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-neutral-surface flex items-center justify-center px-4 py-8">
      <div className="max-w-4xl w-full">
        {/* Header with Logo, Theme Toggle and Language Switcher */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <img 
              src="/assets/favicon.png" 
              alt="Globan Capital logo" 
              className="h-12 md:h-16"
            />
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <LanguageSwitcher />
          </div>
        </div>

        {/* Main Content */}
        <div className="card-white p-8 md:p-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            {t('common.welcome')}
          </h1>
          <p className="text-lg md:text-xl text-neutral-muted mb-12 max-w-2xl mx-auto">
            {t('common.description')}
          </p>

          {/* Role Selection Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {/* Customer Card */}
            <button
              onClick={() => navigate('/login-cliente')}
              className="btn-primary text-white rounded-lg p-8 shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              <div className="text-4xl mb-4">👤</div>
              <h3 className="text-xl font-semibold mb-2">{t('common.iAmCustomer')}</h3>
              <p className="text-sm opacity-90">{t('common.customerDescription')}</p>
            </button>

            {/* Manager Card */}
            <button
              onClick={() => navigate('/admin/login')}
              className="btn-primary text-white rounded-lg p-8 shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              <div className="text-4xl mb-4">👔</div>
              <h3 className="text-xl font-semibold mb-2">{t('common.iAmManager')}</h3>
              <p className="text-sm opacity-90">{t('common.managerDescription')}</p>
            </button>

            {/* Bank Card */}
            <button
              onClick={() => navigate('/admin/bank')}
              className="btn-primary text-white rounded-lg p-8 shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              <div className="text-4xl mb-4">🏦</div>
              <h3 className="text-xl font-semibold mb-2">{t('common.iAmBank')}</h3>
              <p className="text-sm opacity-90">{t('common.bankDescription')}</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

