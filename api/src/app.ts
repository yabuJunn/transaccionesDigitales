import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import transactionsRouter from './routes/transactions';
import bankRouter from './routes/bank';
import './config/firebase'; // Initialize Firebase

const app = express();

// Security middlewares
// In Cloud Functions, don't use helmet as it can interfere with CORS
// CORS is handled at the function level in functions/src/index.ts
if (!process.env.FUNCTIONS_EMULATOR && !process.env.K_SERVICE) {
  // Only use helmet in local development
  app.use(helmet());
}

// CORS configuration
// In Cloud Functions, CORS is handled at the function level (functions/src/index.ts)
// So we don't need CORS middleware here - it would conflict
// In local development, use CORS middleware to allow all origins
if (!process.env.FUNCTIONS_EMULATOR && !process.env.K_SERVICE) {
  // Local development: allow ALL origins for simplicity
  app.use(
    cors({
      origin: true, // Allow all origins in development
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    })
  );
} else {
  // In Cloud Functions: CORS is already handled in functions/src/index.ts
  // But we add a middleware to ensure headers are preserved
  app.use((req, res, next) => {
    // Ensure CORS headers are not removed by Express
    // The function-level CORS handler sets them first
    next();
  });
}

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

app.use(limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check
// In Cloud Functions, accessible at /api/health (via rewrite) or directly at /health
// In local development, accessible at /api/health
const healthPath = process.env.K_SERVICE || process.env.FUNCTIONS_EMULATOR ? '/health' : '/api/health';
app.get(healthPath, (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
// Note: In Cloud Functions, when accessing directly:
// - URL: https://...cloudfunctions.net/api/transactions
// - Firebase Functions receives: /transactions (without /api prefix)
// - So routes should be /transactions, /bank (without /api)
// In local development: routes with /api prefix
if (process.env.K_SERVICE || process.env.FUNCTIONS_EMULATOR) {
  // Cloud Functions: routes without /api prefix
  // Firebase Functions automatically strips the function path (/api) from the route
  app.use('/transactions', transactionsRouter);
  app.use('/bank', bankRouter);
} else {
  // Local development: routes with /api prefix
  app.use('/api/transactions', transactionsRouter);
  app.use('/api/bank', bankRouter);
}

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
  });
});

export default app;

