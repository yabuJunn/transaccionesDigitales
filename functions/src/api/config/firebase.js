"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = exports.db = void 0;
const admin = __importStar(require("firebase-admin"));
const dotenv = __importStar(require("dotenv"));
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
        }
        else {
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
                }
                else {
                    // Real local development without credentials
                    throw new Error('Missing Firebase Admin credentials. Check your .env file.');
                }
            }
            else {
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
    }
    catch (error) {
        // During code analysis, don't fail - just log
        if (process.env.FIREBASE_CONFIG || process.env.GCLOUD_PROJECT) {
            console.warn('⚠️ Firebase Admin initialization skipped during code analysis');
            // Try to initialize with default credentials anyway
            try {
                admin.initializeApp();
            }
            catch (e) {
                // Ignore if it fails during analysis
            }
        }
        else {
            console.error('❌ Error initializing Firebase Admin:', error);
            throw error;
        }
    }
}
exports.db = admin.firestore();
exports.auth = admin.auth();
//# sourceMappingURL=firebase.js.map