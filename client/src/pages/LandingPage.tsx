import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/LandingPage/LanguageSwitcher';

const LandingPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-4xl w-full">
        {/* Header with Language Switcher */}
        <div className="flex justify-end mb-8">
          <LanguageSwitcher />
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('common.welcome')}
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            {t('common.description')}
          </p>

          {/* Role Selection Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {/* Customer Card */}
            <button
              onClick={() => navigate('/client')}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg p-8 shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              <div className="text-4xl mb-4">👤</div>
              <h3 className="text-xl font-semibold mb-2">{t('common.iAmCustomer')}</h3>
              <p className="text-sm opacity-90">Submit a new transaction</p>
            </button>

            {/* Manager Card */}
            <button
              onClick={() => navigate('/admin/login')}
              className="bg-green-600 hover:bg-green-700 text-white rounded-lg p-8 shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              <div className="text-4xl mb-4">👔</div>
              <h3 className="text-xl font-semibold mb-2">{t('common.iAmManager')}</h3>
              <p className="text-sm opacity-90">Access admin dashboard</p>
            </button>

            {/* Bank Card */}
            <button
              onClick={() => navigate('/admin/bank')}
              className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg p-8 shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              <div className="text-4xl mb-4">🏦</div>
              <h3 className="text-xl font-semibold mb-2">{t('common.iAmBank')}</h3>
              <p className="text-sm opacity-90">Bank auditor access</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

