import { Request, Response, NextFunction } from 'express';
import { auth } from '../config/firebase';
import { AuthenticatedRequest } from './auth';

export async function verifyBankToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const header = req.headers.authorization;

  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized: Missing or invalid authorization header' });
    return;
  }

  const idToken = header.split(' ')[1];

  try {
    const decoded = await auth.verifyIdToken(idToken);
    
    // Check custom claims: support both legacy (bank: true) and new (role: "bank")
    const role = decoded.role as string | undefined;
    const bankUids = process.env.BANK_UIDS?.split(',').map(uid => uid.trim()) || [];
    const isBank = 
      decoded.bank === true || 
      role === 'bank' || 
      bankUids.includes(decoded.uid);
    
    const adminUids = process.env.ADMIN_UIDS?.split(',').map(uid => uid.trim()) || [];
    const isAdmin = 
      decoded.admin === true || 
      role === 'admin' || 
      adminUids.includes(decoded.uid);

    // Bank users or admins can access bank endpoints
    if (!isBank && !isAdmin) {
      res.status(403).json({ error: 'Forbidden: Bank or Admin access required' });
      return;
    }

    req.user = {
      uid: decoded.uid,
      email: decoded.email,
      admin: isAdmin,
      bank: isBank || isAdmin, // Admins can also access bank endpoints
      role: role || (decoded.bank ? 'bank' : decoded.admin ? 'admin' : undefined),
    };

    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

