import { Request, Response, NextFunction } from 'express';
export interface AuthenticatedRequest extends Request {
    user?: {
        uid: string;
        email?: string;
        admin?: boolean;
        bank?: boolean;
        role?: string;
    };
}
export declare function verifyFirebaseToken(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
//# sourceMappingURL=auth.d.ts.map