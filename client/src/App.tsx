import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminBankDashboard from './pages/AdminBankDashboard';
import TransactionForm from './components/TransactionForm';
import SuccessMessage from './components/SuccessMessage';
import ErrorMessage from './components/ErrorMessage';
import LanguageSwitcher from './components/LandingPage/LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import AdminRouteGuard from './components/AdminDashboard/AdminRouteGuard';

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

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/client" element={<TransactionFormPage />} />

      {/* Admin routes */}
      <Route 
        path="/admin/login" 
        element={user ? <Navigate to="/admin/dashboard" replace /> : <AdminLogin />} 
      />
      <Route
        path="/admin"
        element={<Navigate to="/admin/dashboard" replace />}
      />
      <Route
        path="/admin/dashboard"
        element={
          <AdminRouteGuard>
            <AdminDashboard />
          </AdminRouteGuard>
        }
      />
      <Route
        path="/admin/bank"
        element={
          <AdminRouteGuard>
            <AdminBankDashboard />
          </AdminRouteGuard>
        }
      />

      {/* Redirect /bank to /admin/bank for backward compatibility */}
      <Route path="/bank" element={<Navigate to="/admin/bank" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

