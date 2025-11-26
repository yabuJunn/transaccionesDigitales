import * as dotenv from 'dotenv';
import * as admin from 'firebase-admin';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

/**
 * Script to set custom claims (admin or bank) for Firebase users
 * 
 * Usage:
 *   tsx scripts/setCustomClaims.ts <uid|email> --claim=admin
 *   tsx scripts/setCustomClaims.ts <uid|email> --claim=bank
 *   tsx scripts/setCustomClaims.ts <uid|email> --claim=admin,bank
 */

// Initialize Firebase Admin
if (!admin.apps.length) {
  try {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    
    if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !privateKey) {
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

async function setCustomClaims(identifier: string, claims: { admin?: boolean; bank?: boolean }): Promise<void> {
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
    const newClaims = {
      ...existingClaims,
      ...claims,
    };
    
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
  console.log('  tsx scripts/setCustomClaims.ts <uid|email> --claim=admin,bank');
  console.log('\nExamples:');
  console.log('  tsx scripts/setCustomClaims.ts user@example.com --claim=admin');
  console.log('  tsx scripts/setCustomClaims.ts abc123xyz --claim=bank');
  process.exit(1);
}

if (!claimArg) {
  console.error('❌ Please specify --claim=admin or --claim=bank');
  process.exit(1);
}

const claimValue = claimArg.split('=')[1];
const claims: { admin?: boolean; bank?: boolean } = {};

if (claimValue.includes('admin')) {
  claims.admin = true;
}
if (claimValue.includes('bank')) {
  claims.bank = true;
}

if (Object.keys(claims).length === 0) {
  console.error('❌ Invalid claim value. Use --claim=admin or --claim=bank or --claim=admin,bank');
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

