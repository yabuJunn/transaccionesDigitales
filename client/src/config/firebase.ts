import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let storage: FirebaseStorage | null = null;

const getFirebaseConfig = () => {
  const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
  const authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN;
  const databaseURL = import.meta.env.VITE_FIREBASE_DATABASE_URL;
  const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
  const storageBucket = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET;

  if (!apiKey || !authDomain || !projectId || !storageBucket) {
    console.warn('⚠️ Firebase configuration is incomplete. Some features may not work.');
    return null;
  }

  return {
    apiKey,
    authDomain,
    databaseURL,
    projectId,
    storageBucket,
  };
};

const initializeFirebase = () => {
  if (app) {
    return app;
  }

  const config = getFirebaseConfig();
  if (!config) {
    return null;
  }

  // Check if Firebase is already initialized
  const existingApps = getApps();
  if (existingApps.length > 0) {
    app = existingApps[0];
  } else {
    try {
      app = initializeApp(config);
    } catch (error) {
      console.error('Error initializing Firebase:', error);
      return null;
    }
  }

  return app;
};

export const getFirebaseAuth = (): Auth | null => {
  if (auth) {
    return auth;
  }

  const firebaseApp = initializeFirebase();
  if (!firebaseApp) {
    return null;
  }

  try {
    auth = getAuth(firebaseApp);
    return auth;
  } catch (error) {
    console.error('Error getting Firebase Auth:', error);
    return null;
  }
};

export const getFirebaseStorage = (): FirebaseStorage | null => {
  if (storage) {
    return storage;
  }

  const firebaseApp = initializeFirebase();
  if (!firebaseApp) {
    return null;
  }

  try {
    storage = getStorage(firebaseApp);
    return storage;
  } catch (error) {
    console.error('Error getting Firebase Storage:', error);
    return null;
  }
};

// Export getters instead of direct values to avoid initialization errors
export { getFirebaseAuth as getAuth, getFirebaseStorage as getStorage };

// Export app getter
export const getApp = () => initializeFirebase();

// Export lazy getters for backward compatibility
// These will return null if Firebase is not configured
export const getAuthInstance = () => getFirebaseAuth();
export const getStorageInstance = () => getFirebaseStorage();

// Default export
export default initializeFirebase();

