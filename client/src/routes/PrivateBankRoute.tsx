import { ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { isBank } from '../firebase/authClient';
import { useTranslation } from 'react-i18next';

interface PrivateBankRouteProps {
  children: ReactNode;
}

/**
 * Componente de ruta protegida para banco/auditor
 * Verifica que el usuario esté autenticado y tenga el rol "bank"
 */
const PrivateBankRoute = ({ children }: PrivateBankRouteProps) => {
  const { user, loading: authLoading } = useAuth();
  const { t } = useTranslation();
  const [role, setRole] = useState<string | null>(null);
  const [checkingRole, setCheckingRole] = useState(true);

  useEffect(() => {
    const checkRole = async () => {
      if (!user) {
        setCheckingRole(false);
        return;
      }

      try {
        // Verificar si es banco usando la función isBank que verifica tanto role como bank claim
        const userIsBank = await isBank(user);
        if (userIsBank) {
          setRole('bank');
        } else {
          setRole(null);
        }
      } catch (error) {
        console.error('Error al verificar el rol:', error);
        setRole(null);
      } finally {
        setCheckingRole(false);
      }
    };

    checkRole();
  }, [user]);

  // Mostrar loading mientras se verifica la autenticación o el rol
  if (authLoading || checkingRole) {
    return (
      <div className="min-h-screen bg-neutral-surface flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-neutral-muted">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  // Si no hay usuario, redirigir al login de banco
  if (!user) {
    return <Navigate to="/login-bank" replace />;
  }

  // Verificar si tiene rol de banco
  const hasBankRole = role === 'bank';

  if (!hasBankRole) {
    return (
      <div className="min-h-screen bg-neutral-surface flex items-center justify-center px-4">
        <div className="max-w-md w-full card-white p-8 text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-primary mb-4">
            {t('loginBank.role_required')}
          </h1>
          <p className="text-neutral-muted mb-6">
            {t('loginBank.error_wrong_role')}
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="btn-primary text-white px-6 py-2 rounded-lg"
          >
            {t('loginBank.backToHome')}
          </button>
        </div>
      </div>
    );
  }

  // Si todo está bien, renderizar el contenido protegido
  return <>{children}</>;
};

export default PrivateBankRoute;

