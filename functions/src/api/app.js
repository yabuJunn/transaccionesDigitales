"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const transactions_1 = __importDefault(require("./routes/transactions"));
const bank_1 = __importDefault(require("./routes/bank"));
require("./config/firebase"); // Initialize Firebase
const app = (0, express_1.default)();
// Security middlewares
app.use((0, helmet_1.default)());
// CORS configuration
const allowedOrigins = [
    'http://localhost:5173', // Vite default
    'http://localhost:5174', // Alternative Vite port
    'http://localhost:3000',
    'http://localhost:5000', // Firebase Hosting emulator
    process.env.CLIENT_URL,
    process.env.ADMIN_URL,
].filter(Boolean);
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, Postman, etc.)
        if (!origin)
            return callback(null, true);
        // In Cloud Functions, allow requests from Firebase Hosting
        if (process.env.FUNCTIONS_EMULATOR || process.env.K_SERVICE) {
            return callback(null, true);
        }
        if (allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development') {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));
// Rate limiting
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);
// Body parsing
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// API routes
app.use('/api/transactions', transactions_1.default);
app.use('/api/bank', bank_1.default);
// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});
// Error handler
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
    });
});
exports.default = app;
//# sourceMappingURL=app.js.map