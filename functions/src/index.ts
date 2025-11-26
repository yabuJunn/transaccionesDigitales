import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Request, Response } from 'express';
// Import from copied api code in lib/api (api must be built before functions)
import app from './api/app';

// Initialize Firebase Admin
// In Cloud Functions, this uses default credentials automatically
if (!admin.apps.length) {
  admin.initializeApp();
}

// Export the Express app as a Cloud Function
// This function will handle all routes defined in the Express app
export const api = functions
  .region('us-central1') // Change to your preferred region
  .https.onRequest((req: Request, res: Response) => {
    // Add logging for debugging
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
      res.set('Access-Control-Allow-Origin', '*');
      res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      res.status(204).send('');
      return;
    }
    
    // Delegate to Express app
    return app(req, res);
  });

