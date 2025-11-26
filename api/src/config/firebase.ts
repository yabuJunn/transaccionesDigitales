import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';

// Only load dotenv in development or when not running in Cloud Functions
if (!process.env.K_SERVICE && !process.env.FUNCTIONS_EMULATOR) {
  dotenv.config();
}

if (!admin.apps.length) {
  try {
    // In Cloud Functions, use default credentials
    // In local development or emulator, use service account from env
    if (process.env.K_SERVICE || process.env.FUNCTIONS_EMULATOR) {
      // Running in Cloud Functions or Functions Emulator
      // Use default credentials (automatically provided by Firebase)
      admin.initializeApp();
      console.log('✅ Firebase Admin initialized with default credentials (Cloud Functions)');
    } else {
      // Local development - use service account from .env
      const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
      
      // During Firebase code analysis (deploy), credentials may not be available
      // In this case, try to use default credentials or skip initialization
      if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !privateKey) {
        // If we're being analyzed by Firebase CLI during deploy, try default credentials
        // Otherwise, this is a real error in local development
        if (process.env.FIREBASE_CONFIG || process.env.GCLOUD_PROJECT) {
          // Likely being analyzed during deploy - use default credentials
          admin.initializeApp();
          console.log('✅ Firebase Admin initialized with default credentials (deploy analysis)');
        } else {
          // Real local development without credentials
          throw new Error('Missing Firebase Admin credentials. Check your .env file.');
        }
      } else {
        // We have credentials, use them
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: privateKey,
          }),
        });

        console.log('✅ Firebase Admin initialized with service account (local development)');
      }
    }
  } catch (error) {
    // During code analysis, don't fail - just log
    if (process.env.FIREBASE_CONFIG || process.env.GCLOUD_PROJECT) {
      console.warn('⚠️ Firebase Admin initialization skipped during code analysis');
      // Try to initialize with default credentials anyway
      try {
        admin.initializeApp();
      } catch (e) {
        // Ignore if it fails during analysis
      }
    } else {
      console.error('❌ Error initializing Firebase Admin:', error);
      throw error;
    }
  }
}

export const db = admin.firestore();
export const auth = admin.auth();

