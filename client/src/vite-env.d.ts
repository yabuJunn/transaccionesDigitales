/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  readonly VITE_FIREBASE_API_KEY?: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN?: string;
  readonly VITE_FIREBASE_DATABASE_URL?: string;
  readonly VITE_FIREBASE_PROJECT_ID?: string;
  readonly VITE_FIREBASE_STORAGE_BUCKET?: string;
  readonly PROD?: boolean;
  readonly DEV?: boolean;
  readonly MODE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

