import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { loginBank } from '../firebase/authClient';
import LanguageSwitcher from '../components/LandingPage/LanguageSwitcher';
import ThemeToggle from '../components/ThemeToggle';

const LoginBank = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Validaciones básicas
      if (!email || !password) {
        setError(t('loginBank.error_invalid'));
        setLoading(false);
        return;
      }

      if (!email.includes('@')) {
        setError(t('loginBank.error_invalid'));
        setLoading(false);
        return;
      }

      // Intentar login - loginBank verificará el rol automáticamente
      await loginBank(email, password);
      
      // Si el login es exitoso, redirigir al dashboard del banco
      // El PrivateBankRoute verificará el rol
      navigate('/bank');
    } catch (err: any) {
      // Manejar errores específicos con traducciones
      if (err.message === 'Este usuario no pertenece al rol Banco.') {
        setError(t('loginBank.error_wrong_role'));
      } else if (err.message === 'Usuario no encontrado') {
        setError(t('loginBank.error_invalid'));
      } else if (err.message === 'Contraseña incorrecta') {
        setError(t('loginBank.error_invalid'));
      } else {
        setError(err.message || t('loginBank.error_invalid'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-surface flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        {/* Header */}
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

        {/* Login Card */}
        <div className="card-white p-8">
          <h1 className="text-3xl font-bold text-primary mb-2 text-center">
            {t('loginBank.title')}
          </h1>
          <p className="text-neutral-muted text-center mb-8">
            {t('loginBank.subtitle')}
          </p>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-foreground mb-2">
                {t('loginBank.email')}
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder={t('loginBank.email')}
                disabled={loading}
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-foreground mb-2">
                {t('loginBank.password')}
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="••••••••"
                disabled={loading}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary text-white py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? t('common.loading') : t('loginBank.login_button')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-primary hover:underline text-sm"
            >
              {t('loginBank.backToHome')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginBank;

