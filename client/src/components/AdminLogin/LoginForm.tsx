import { FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import ThemeToggle from '../ThemeToggle';

interface LoginFormProps {
  email: string;
  password: string;
  error: string;
  loading: boolean;
  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
  onSubmit: (e: FormEvent) => void;
}

const LoginForm = ({
  email,
  password,
  error,
  loading,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}: LoginFormProps) => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-surface py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="flex justify-end">
          <ThemeToggle />
        </div>
        <div className="text-center">
          <img 
            src="/assets/favicon.png" 
            alt="Globan Capital logo" 
            className="h-16 mx-auto mb-6"
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-primary">
            {t('admin.loginTitle')}
          </h2>
          <p className="mt-2 text-center text-sm text-neutral-muted">
            {t('admin.loginSubtitle')}
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={onSubmit}>
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded-md">
              {error}
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                {t('admin.email')}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => onEmailChange(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-neutral-border bg-neutral-bg placeholder-neutral-muted-2 text-neutral-text rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder={t('admin.email')}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                {t('admin.password')}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => onPasswordChange(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-neutral-border bg-neutral-bg placeholder-neutral-muted-2 text-neutral-text rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder={t('admin.password')}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? t('admin.signingIn') : t('admin.signIn')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;

