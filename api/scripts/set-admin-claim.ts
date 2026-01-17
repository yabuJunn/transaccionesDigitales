import * as dotenv from 'dotenv';
import { auth } from '../src/config/firebase';

dotenv.config();

/**
 * Script to set custom claim 'admin: true' for a user
 * Usage: tsx scripts/set-admin-claim.ts <user-email>
 */
async function setAdminClaim(email: string): Promise<void> {
  try {
    const user = await auth.getUserByEmail(email);
    const existingClaims = user.customClaims || {};
    
    // Asignar custom claims: role: "admin" y admin: true (para compatibilidad)
    await auth.setCustomUserClaims(user.uid, {
      ...existingClaims,
      role: 'admin',
      admin: true, // Mantener compatibilidad con sistema legacy
    });
    
    console.log(`✅ Successfully set admin role for user: ${email} (UID: ${user.uid})`);
    console.log(`   Claims: role: "admin", admin: true`);
    console.log('⚠️  User must sign out and sign in again for the claim to take effect');
  } catch (error) {
    console.error('❌ Error setting admin claim:', error);
    process.exit(1);
  }
}

const email = process.argv[2];

if (!email) {
  console.error('❌ Please provide a user email as argument');
  console.log('Usage: tsx scripts/set-admin-claim.ts <user-email>');
  process.exit(1);
}

setAdminClaim(email)
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Failed:', error);
    process.exit(1);
  });

