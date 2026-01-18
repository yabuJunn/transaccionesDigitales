import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../context/AuthContext';
import { createClientAccount } from '../../../services/api';
import LanguageSwitcher from '../../../components/LandingPage/LanguageSwitcher';
import ThemeToggle from '../../../components/ThemeToggle';
import SuccessMessage from '../../../components/SuccessMessage';
import ErrorMessage from '../../../components/ErrorMessage';

const RegisterClient = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { getIdToken } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      // Validaciones
      if (!email || !password || !confirmPassword) {
        setError(t('registerClient.error_required'));
        setLoading(false);
        return;
      }

      if (!email.includes('@')) {
        setError(t('registerClient.error_invalid_email'));
        setLoading(false);
        return;
      }

      if (password.length < 6) {
        setError(t('registerClient.error_password_length'));
        setLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        setError(t('registerClient.error_mismatch'));
        setLoading(false);
        return;
      }

      // Obtener token de admin
      const token = await getIdToken();
      if (!token) {
        setError(t('registerClient.error_unauthorized'));
        setLoading(false);
        return;
      }

      // Crear cuenta
      await createClientAccount(token, { email, password });
      
      // Mostrar mensaje de éxito
      setSuccess(t('registerClient.success'));
      
      // Limpiar formulario
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      // Manejar errores de la API
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError(t('registerClient.error_general'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-surface py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <img 
              src="/assets/favicon.png" 
              alt="165 Group logo" 
              className="h-12 md:h-16"
            />
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <LanguageSwitcher />
          </div>
        </div>

        {/* Form Card */}
        <div className="card-white p-8">
          <h1 className="text-3xl font-bold text-primary mb-2">
            {t('registerClient.title')}
          </h1>
          <p className="text-neutral-muted mb-8">
            {t('registerClient.subtitle')}
          </p>

          {success && (
            <SuccessMessage message={success} onClose={() => setSuccess(null)} />
          )}

          {error && (
            <ErrorMessage message={error} onClose={() => setError(null)} />
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-foreground mb-2">
                {t('registerClient.email')} *
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder={t('registerClient.email_placeholder')}
                disabled={loading}
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-foreground mb-2">
                {t('registerClient.password')} *
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder={t('registerClient.password_placeholder')}
                disabled={loading}
                required
                minLength={6}
              />
              <p className="text-xs text-neutral-muted mt-1">
                {t('registerClient.password_hint')}
              </p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-foreground mb-2">
                {t('registerClient.confirm_password')} *
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder={t('registerClient.confirm_password_placeholder')}
                disabled={loading}
                required
                minLength={6}
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 btn-primary text-white py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? t('common.loading') : t('registerClient.create_account')}
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin/dashboard')}
                className="px-6 py-3 bg-neutral-surface-alt text-neutral-text rounded-lg hover:bg-neutral-surface transition-colors"
              >
                {t('registerClient.back_dashboard')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterClient;

