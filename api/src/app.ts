import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import transactionsRouter from './routes/transactions';
import bankRouter from './routes/bank';
import './config/firebase'; // Initialize Firebase

const app = express();

// Security middlewares
app.use(helmet());

// CORS configuration
const allowedOrigins = [
  'http://localhost:5173', // Vite default
  'http://localhost:5174', // Alternative Vite port
  'http://localhost:3000',
  'http://localhost:5000', // Firebase Hosting emulator
  process.env.CLIENT_URL,
  process.env.ADMIN_URL,
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);
      
      // In Cloud Functions, allow requests from Firebase Hosting
      if (process.env.FUNCTIONS_EMULATOR || process.env.K_SERVICE) {
        return callback(null, true);
      }
      
      if (allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development') {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

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
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/transactions', transactionsRouter);
app.use('/api/bank', bankRouter);

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

