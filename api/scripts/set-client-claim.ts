import * as dotenv from 'dotenv';
import * as admin from 'firebase-admin';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

/**
 * Script to set "client" role for Firebase users
 * 
 * Usage: tsx scripts/set-client-claim.ts <user-email>
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

const email = process.argv[2];

if (!email) {
  console.error('❌ Please provide a user email as argument');
  console.log('Usage: tsx scripts/set-client-claim.ts <user-email>');
  console.log('Example: tsx scripts/set-client-claim.ts cliente@example.com');
  process.exit(1);
}

async function setClientRole() {
  try {
    // Get user by email
    const user = await admin.auth().getUserByEmail(email);
    
    // Get existing claims to preserve them
    const existingClaims = user.customClaims || {};
    
    // Set role to "client"
    await admin.auth().setCustomUserClaims(user.uid, {
      ...existingClaims,
      role: 'client',
    });
    
    console.log(`✅ Successfully set "client" role for user: ${email} (UID: ${user.uid})`);
    console.log('⚠️  User must sign out and sign in again for the role to take effect');
  } catch (error: any) {
    if (error.code === 'auth/user-not-found') {
      console.error(`❌ User not found with email: ${email}`);
    } else {
      console.error('❌ Error setting client role:', error);
    }
    process.exit(1);
  }
}

setClientRole()
  .then(() => {
    console.log('✅ Done');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Failed:', error);
    process.exit(1);
  });

