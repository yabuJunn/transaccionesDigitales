import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminBankDashboard from './pages/AdminBankDashboard';
import LoginCliente from './pages/LoginCliente';
import LoginBank from './pages/LoginBank';
import RegisterClient from './pages/admin/register-client/RegisterClient';
import RegisterBank from './pages/admin/register-bank/RegisterBank';
import TransactionForm from './components/TransactionForm';
import SuccessMessage from './components/SuccessMessage';
import ErrorMessage from './components/ErrorMessage';
import LanguageSwitcher from './components/LandingPage/LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import AdminRouteGuard from './components/AdminDashboard/AdminRouteGuard';
import PrivateClientRoute from './routes/PrivateClientRoute';
import PrivateBankRoute from './routes/PrivateBankRoute';
import { logout } from './firebase/authClient';

function TransactionFormPage() {
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSuccess = (message: string) => {
    setSuccess(message);
    setError(null);
  };

  const handleError = (message: string) => {
    setError(message);
    setSuccess(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login-cliente');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-surface py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <header>
            <h1 className="text-3xl font-bold text-primary mb-2">
              {t('form.title')}
            </h1>
            <p className="text-neutral-muted">
              {t('form.subtitle')}
            </p>
            {user?.email && (
              <p className="text-sm text-neutral-muted mt-2">
                {t('form.loggedInAs')}: <span className="font-semibold text-primary">{user.email}</span>
              </p>
            )}
          </header>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            {user && (
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors duration-200"
                title={t('form.logout')}
              >
                {t('form.logout')}
              </button>
            )}
          </div>
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
      <Route path="/login-cliente" element={<LoginCliente />} />
      <Route path="/login-bank" element={<LoginBank />} />
      
      {/* Protected client route */}
      <Route
        path="/client"
        element={
          <PrivateClientRoute>
            <TransactionFormPage />
          </PrivateClientRoute>
        }
      />

      {/* Protected bank route */}
      <Route
        path="/bank"
        element={
          <PrivateBankRoute>
            <AdminBankDashboard />
          </PrivateBankRoute>
        }
      />

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
        path="/admin/register-client"
        element={
          <AdminRouteGuard>
            <RegisterClient />
          </AdminRouteGuard>
        }
      />
      <Route
        path="/admin/register-bank"
        element={
          <AdminRouteGuard>
            <RegisterBank />
          </AdminRouteGuard>
        }
      />
      {/* Redirect /admin/bank to /bank for consistency */}
      <Route path="/admin/bank" element={<Navigate to="/bank" replace />} />
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

