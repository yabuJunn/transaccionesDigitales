import * as dotenv from 'dotenv';
import * as admin from 'firebase-admin';
import * as path from 'path';
import * as fs from 'fs';

// Get project root (assumes script is in scripts/ folder)
// process.cwd() returns the directory from which the command was executed
const cwd = process.cwd();
const projectRoot = cwd;
const apiDir = path.resolve(projectRoot, 'api');

// Load environment variables - try multiple locations
const rootEnvPath = path.resolve(projectRoot, '.env');
const apiEnvPath = path.resolve(apiDir, '.env');

// Try to load .env from project root first, then from api folder
let envLoaded = false;
if (fs.existsSync(rootEnvPath)) {
  dotenv.config({ path: rootEnvPath });
  console.log('✅ Loaded .env from project root');
  envLoaded = true;
} else if (fs.existsSync(apiEnvPath)) {
  dotenv.config({ path: apiEnvPath });
  console.log('✅ Loaded .env from api folder');
  envLoaded = true;
} else {
  // Try default location (current working directory)
  dotenv.config();
  if (fs.existsSync(path.resolve(cwd, '.env'))) {
    console.log('✅ Loaded .env from current working directory');
    envLoaded = true;
  } else {
    console.log('⚠️  No .env file found in common locations');
  }
}

/**
 * Script to set custom claims (admin, bank, or client) for Firebase users
 * 
 * Usage:
 *   tsx scripts/setCustomClaims.ts <uid|email> --claim=admin
 *   tsx scripts/setCustomClaims.ts <uid|email> --claim=bank
 *   tsx scripts/setCustomClaims.ts <uid|email> --claim=client
 *   tsx scripts/setCustomClaims.ts <uid|email> --claim=admin,bank
 *   tsx scripts/setCustomClaims.ts <uid|email> --claim=role:client
 */

// Initialize Firebase Admin
if (!admin.apps.length) {
  try {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    
    if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !privateKey) {
      console.error('\n❌ Missing Firebase Admin credentials.');
      console.error('   Please check your .env file. It should be located in:');
      console.error('   - Project root: .env');
      console.error('   - Or in api folder: api/.env');
      console.error('\n   Required variables:');
      console.error('   - FIREBASE_PROJECT_ID');
      console.error('   - FIREBASE_CLIENT_EMAIL');
      console.error('   - FIREBASE_PRIVATE_KEY');
      console.error('\n   See README.md for instructions on how to set up Firebase credentials.\n');
      throw new Error('Missing Firebase Admin credentials. Check your .env file.');
    }

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey,
      }),
    });

    console.log('✅ Firebase Admin initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing Firebase Admin:', error);
    process.exit(1);
  }
}

async function setCustomClaims(identifier: string, claims: { admin?: boolean; bank?: boolean; role?: string }): Promise<void> {
  try {
    let user: admin.auth.UserRecord;
    
    // Try to get user by UID first, then by email
    try {
      user = await admin.auth().getUser(identifier);
    } catch {
      try {
        user = await admin.auth().getUserByEmail(identifier);
      } catch {
        throw new Error(`User not found: ${identifier}`);
      }
    }
    
    // Get existing claims to preserve them
    const existingClaims = user.customClaims || {};
    
    // Build new claims object
    const newClaims: any = {
      ...existingClaims,
    };
    
    // Handle role separately (role: "client" or role: "bank")
    if (claims.role) {
      newClaims.role = claims.role;
      // Si es role: "bank", también establecer bank: true para compatibilidad
      if (claims.role === 'bank') {
        newClaims.bank = true;
      }
    }
    
    // For admin and bank (legacy), use boolean flags
    if (claims.admin !== undefined) newClaims.admin = claims.admin;
    if (claims.bank !== undefined) {
      newClaims.bank = claims.bank;
      // Si se establece bank: true pero no hay role, establecer role: "bank"
      if (claims.bank && !newClaims.role) {
        newClaims.role = 'bank';
      }
    }
    
    await admin.auth().setCustomUserClaims(user.uid, newClaims);
    
    console.log(`✅ Successfully set custom claims for user: ${user.email || user.uid} (UID: ${user.uid})`);
    console.log(`   Claims:`, newClaims);
    console.log('⚠️  User must sign out and sign in again for the claims to take effect');
  } catch (error) {
    console.error('❌ Error setting custom claims:', error);
    throw error;
  }
}

// Parse command line arguments
const identifier = process.argv[2];
const claimArg = process.argv.find(arg => arg.startsWith('--claim='));

if (!identifier) {
  console.error('❌ Please provide a user UID or email as argument');
  console.log('\nUsage:');
  console.log('  tsx scripts/setCustomClaims.ts <uid|email> --claim=admin');
  console.log('  tsx scripts/setCustomClaims.ts <uid|email> --claim=bank');
  console.log('  tsx scripts/setCustomClaims.ts <uid|email> --claim=client');
  console.log('  tsx scripts/setCustomClaims.ts <uid|email> --claim=role:client');
  console.log('  tsx scripts/setCustomClaims.ts <uid|email> --claim=admin,bank');
  console.log('\nExamples:');
  console.log('  tsx scripts/setCustomClaims.ts user@example.com --claim=admin');
  console.log('  tsx scripts/setCustomClaims.ts user@example.com --claim=client');
  console.log('  tsx scripts/setCustomClaims.ts abc123xyz --claim=bank');
  process.exit(1);
}

if (!claimArg) {
  console.error('❌ Please specify --claim=admin, --claim=bank, or --claim=client');
  process.exit(1);
}

const claimValue = claimArg.split('=')[1];
const claims: { admin?: boolean; bank?: boolean; role?: string } = {};

// Check for role:client or role:bank format
if (claimValue.startsWith('role:')) {
  const roleValue = claimValue.split(':')[1];
  claims.role = roleValue;
  // Si es role:bank, también establecer bank: true para compatibilidad
  if (roleValue === 'bank') {
    claims.bank = true;
  }
} else {
  // Legacy format: admin, bank, or client
  if (claimValue.includes('admin')) {
    claims.role = 'admin';
    claims.admin = true; // Mantener compatibilidad con sistema legacy
  }
  if (claimValue.includes('bank')) {
    claims.role = 'bank';
    claims.bank = true; // Mantener compatibilidad
  }
  if (claimValue.includes('client')) {
    claims.role = 'client';
  }
}

if (Object.keys(claims).length === 0) {
  console.error('❌ Invalid claim value. Use --claim=admin, --claim=bank, --claim=client, or --claim=role:client');
  process.exit(1);
}

setCustomClaims(identifier, claims)
  .then(() => {
    console.log('✅ Done');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Failed:', error);
    process.exit(1);
  });

