import * as dotenv from 'dotenv';
import { auth } from '../src/config/firebase';

dotenv.config();

async function setBankClaim(email: string): Promise<void> {
  try {
    const user = await auth.getUserByEmail(email);
    
    // Get existing claims to preserve them
    const existingClaims = user.customClaims || {};
    
    // Set custom claims: both role: "bank" and bank: true (for compatibility)
    await auth.setCustomUserClaims(user.uid, {
      ...existingClaims,
      role: 'bank',
      bank: true, // Mantener compatibilidad con sistema legacy
    });

    console.log(`✅ Successfully set bank role for user: ${email} (UID: ${user.uid})`);
    console.log(`   Claims: role: "bank", bank: true`);
    console.log('⚠️  Important: The user must sign out and sign in again for the claim to take effect.');
  } catch (error) {
    console.error('❌ Error setting bank claim:', error);
    process.exit(1);
  }
}

// Get email from command line argument
const email = process.argv[2];

if (!email) {
  console.error('❌ Please provide an email address as an argument');
  console.log('Usage: npm run set-bank-claim <email>');
  console.log('Example: npm run set-bank-claim bank@example.com');
  process.exit(1);
}

setBankClaim(email)
  .then(() => {
    console.log('✅ Done');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });

