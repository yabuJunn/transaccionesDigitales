import { signInWithEmailAndPassword, signOut, getIdTokenResult, User } from 'firebase/auth';
import { getFirebaseAuth } from '../config/firebase';

/**
 * Login de cliente con Firebase Authentication
 * @param email - Email del cliente
 * @param password - Contraseña del cliente
 * @returns Usuario autenticado
 */
export const loginCliente = async (email: string, password: string): Promise<User> => {
  const auth = getFirebaseAuth();
  if (!auth) {
    throw new Error('Firebase Auth no está configurado');
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    // Manejar errores comunes de Firebase Auth
    if (error.code === 'auth/user-not-found') {
      throw new Error('Usuario no encontrado');
    } else if (error.code === 'auth/wrong-password') {
      throw new Error('Contraseña incorrecta');
    } else if (error.code === 'auth/invalid-email') {
      throw new Error('Email inválido');
    } else if (error.code === 'auth/user-disabled') {
      throw new Error('Usuario deshabilitado');
    } else if (error.code === 'auth/too-many-requests') {
      throw new Error('Demasiados intentos. Intenta más tarde');
    } else {
      throw new Error(error.message || 'Error al iniciar sesión');
    }
  }
};

/**
 * Cerrar sesión del cliente
 */
export const logout = async (): Promise<void> => {
  const auth = getFirebaseAuth();
  if (!auth) {
    return;
  }

  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    throw new Error('Error al cerrar sesión');
  }
};

/**
 * Obtener el rol del usuario actual desde los custom claims
 * @param user - Usuario de Firebase Auth
 * @returns Rol del usuario ('client', 'admin', 'bank', o null)
 */
export const getCurrentUserRole = async (user: User | null): Promise<string | null> => {
  if (!user) {
    return null;
  }

  try {
    const tokenResult = await getIdTokenResult(user, true); // true para forzar refresh del token
    return tokenResult.claims.role as string | null;
  } catch (error) {
    console.error('Error al obtener el rol del usuario:', error);
    return null;
  }
};

/**
 * Verificar si el usuario tiene el rol de cliente
 * @param user - Usuario de Firebase Auth
 * @returns true si el usuario tiene rol 'client'
 */
export const isClient = async (user: User | null): Promise<boolean> => {
  const role = await getCurrentUserRole(user);
  return role === 'client';
};

