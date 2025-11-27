import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import cors from 'cors';
import { Request, Response } from 'express';
// Import from copied api code in lib/api (api must be built before functions)
import app from './api/app';

// Initialize Firebase Admin
// In Cloud Functions, this uses default credentials automatically
if (!admin.apps.length) {
  admin.initializeApp();
}

// Configure CORS to allow ALL origins
const corsOptions = {
  origin: true, // Allow all origins
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

// Export the Express app as a Cloud Function
// This function will handle all routes defined in the Express app
export const api = functions
  .region('us-central1') // Change to your preferred region
  .https.onRequest((req: Request, res: Response) => {
    // Add logging for debugging
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    console.log(`Origin: ${req.headers.origin}`);
    
    // Apply CORS middleware FIRST before Express
    // This handles both preflight (OPTIONS) and actual requests
    cors(corsOptions)(req, res, () => {
      // After CORS is handled, delegate to Express app
      return app(req, res);
    });
  });

