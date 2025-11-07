import { Request, Response, NextFunction } from 'express';
import { auth } from '../config/firebase';

export interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email?: string;
    admin?: boolean;
  };
}

export async function verifyFirebaseToken(
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
    
    // Check custom claim or ADMIN_UIDS env var
    const adminUids = process.env.ADMIN_UIDS?.split(',').map(uid => uid.trim()) || [];
    const isAdmin = decoded.admin === true || adminUids.includes(decoded.uid);

    if (!isAdmin) {
      res.status(403).json({ error: 'Forbidden: Admin access required' });
      return;
    }

    req.user = {
      uid: decoded.uid,
      email: decoded.email,
      admin: true,
    };

    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

