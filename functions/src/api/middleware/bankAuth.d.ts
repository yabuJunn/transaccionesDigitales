import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth';
export declare function verifyBankToken(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
//# sourceMappingURL=bankAuth.d.ts.map