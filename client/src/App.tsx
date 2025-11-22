import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import LandingPage from './components/LandingPage';
import TransactionForm from './components/TransactionForm';
import SuccessMessage from './components/SuccessMessage';
import ErrorMessage from './components/ErrorMessage';
import LanguageSwitcher from './components/LanguageSwitcher';
import { useTranslation } from 'react-i18next';

function TransactionFormPage() {
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  const handleSuccess = (message: string) => {
    setSuccess(message);
    setError(null);
  };

  const handleError = (message: string) => {
    setError(message);
    setSuccess(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <header>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {t('form.title')}
            </h1>
            <p className="text-gray-600">
              {t('form.subtitle')}
            </p>
          </header>
          <LanguageSwitcher />
        </div>

        {success && (
          <SuccessMessage message={success} onClose={() => setSuccess(null)} />
        )}

        {error && (
          <ErrorMessage message={error} onClose={() => setError(null)} />
        )}

        <TransactionForm
          onSuccess={handleSuccess}
          onError={handleError}
        />
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/client" element={<TransactionFormPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

