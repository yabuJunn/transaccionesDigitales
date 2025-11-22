import * as dotenv from 'dotenv';
import { auth } from '../src/config/firebase';

dotenv.config();

async function setBankClaim(email: string): Promise<void> {
  try {
    const user = await auth.getUserByEmail(email);
    
    // Set custom claim
    await auth.setCustomUserClaims(user.uid, {
      bank: true,
    });

    console.log(`✅ Successfully set bank:true claim for user: ${email} (UID: ${user.uid})`);
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

