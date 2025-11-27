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
// In Cloud Functions, don't use helmet as it can interfere with CORS
// CORS is handled at the function level in functions/src/index.ts
if (!process.env.FUNCTIONS_EMULATOR && !process.env.K_SERVICE) {
    // Only use helmet in local development
    app.use((0, helmet_1.default)());
}
// CORS configuration
// In Cloud Functions, CORS is handled at the function level (functions/src/index.ts)
// So we don't need CORS middleware here - it would conflict
// In local development, use CORS middleware to allow all origins
if (!process.env.FUNCTIONS_EMULATOR && !process.env.K_SERVICE) {
    // Local development: allow ALL origins for simplicity
    app.use((0, cors_1.default)({
        origin: true, // Allow all origins in development
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    }));
}
else {
    // In Cloud Functions: CORS is already handled in functions/src/index.ts
    // But we add a middleware to ensure headers are preserved
    app.use((req, res, next) => {
        // Ensure CORS headers are not removed by Express
        // The function-level CORS handler sets them first
        next();
    });
}
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
    app.use('/transactions', transactions_1.default);
    app.use('/bank', bank_1.default);
}
else {
    // Local development: routes with /api prefix
    app.use('/api/transactions', transactions_1.default);
    app.use('/api/bank', bank_1.default);
}
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