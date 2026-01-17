"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyFirebaseToken = verifyFirebaseToken;
const firebase_1 = require("../config/firebase");
async function verifyFirebaseToken(req, res, next) {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Unauthorized: Missing or invalid authorization header' });
        return;
    }
    const idToken = header.split(' ')[1];
    try {
        const decoded = await firebase_1.auth.verifyIdToken(idToken);
        // Check custom claims: support both legacy (admin: true) and new (role: "admin")
        const adminUids = process.env.ADMIN_UIDS?.split(',').map(uid => uid.trim()) || [];
        const role = decoded.role;
        const isAdmin = decoded.admin === true ||
            role === 'admin' ||
            adminUids.includes(decoded.uid);
        if (!isAdmin) {
            res.status(403).json({ error: 'Forbidden: Admin access required' });
            return;
        }
        req.user = {
            uid: decoded.uid,
            email: decoded.email,
            admin: true,
            role: role || (decoded.admin ? 'admin' : undefined),
        };
        next();
    }
    catch (error) {
        console.error('Token verification error:', error);
        res.status(401).json({ error: 'Invalid or expired token' });
    }
}
//# sourceMappingURL=auth.js.map