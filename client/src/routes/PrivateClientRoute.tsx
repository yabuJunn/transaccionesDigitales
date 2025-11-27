import { ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getCurrentUserRole } from '../firebase/authClient';

interface PrivateClientRouteProps {
  children: ReactNode;
}

/**
 * Componente de ruta protegida para clientes
 * Verifica que el usuario esté autenticado y tenga el rol "client"
 */
const PrivateClientRoute = ({ children }: PrivateClientRouteProps) => {
  const { user, loading: authLoading } = useAuth();
  const [role, setRole] = useState<string | null>(null);
  const [checkingRole, setCheckingRole] = useState(true);

  useEffect(() => {
    const checkRole = async () => {
      if (!user) {
        setCheckingRole(false);
        return;
      }

      try {
        const userRole = await getCurrentUserRole(user);
        setRole(userRole);
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
          <p className="text-neutral-muted">Verificando permisos...</p>
        </div>
      </div>
    );
  }

  // Si no hay usuario, redirigir al login
  if (!user) {
    return <Navigate to="/login-cliente" replace />;
  }

  // Si el usuario no tiene el rol "client", mostrar error de permisos
  if (role !== 'client') {
    return (
      <div className="min-h-screen bg-neutral-surface flex items-center justify-center px-4">
        <div className="max-w-md w-full card-white p-8 text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-primary mb-4">
            Acceso Denegado
          </h1>
          <p className="text-neutral-muted mb-6">
            No tienes permisos para acceder a esta sección. 
            Necesitas tener el rol de cliente.
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="btn-primary text-white px-6 py-2 rounded-lg"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  // Si todo está bien, renderizar el contenido protegido
  return <>{children}</>;
};

export default PrivateClientRoute;

