import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { loginCliente } from '../firebase/authClient';
import LanguageSwitcher from '../components/LandingPage/LanguageSwitcher';
import ThemeToggle from '../components/ThemeToggle';

const LoginCliente = () => {
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
        setError('Por favor completa todos los campos');
        setLoading(false);
        return;
      }

      if (!email.includes('@')) {
        setError('Por favor ingresa un email válido');
        setLoading(false);
        return;
      }

      // Intentar login
      await loginCliente(email, password);
      
      // Si el login es exitoso, redirigir al formulario
      // El PrivateClientRoute verificará el rol
      navigate('/client');
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
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
            {t('login.client.title', 'Iniciar Sesión - Cliente')}
          </h1>
          <p className="text-neutral-muted text-center mb-8">
            {t('login.client.subtitle', 'Ingresa tus credenciales para acceder al formulario')}
          </p>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-foreground mb-2">
                {t('login.email', 'Email')}
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder={t('login.emailPlaceholder', 'tu@email.com')}
                disabled={loading}
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-foreground mb-2">
                {t('login.password', 'Contraseña')}
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder={t('login.passwordPlaceholder', '••••••••')}
                disabled={loading}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary text-white py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? t('login.loading', 'Iniciando sesión...') : t('login.submit', 'Iniciar Sesión')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-primary hover:underline text-sm"
            >
              {t('login.backToHome', 'Volver al inicio')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginCliente;

