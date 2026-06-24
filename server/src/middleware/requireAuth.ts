import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/index';
import { verifyAccessToken } from '../services/authService';

export const requireAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
//   1. Read the Authorization header from the request
//   2. If it's missing, return 401 immediately 
 const authHeader = req.headers.authorization;
if (!authHeader) {
  res.status(401).json({ error: 'Unauthorised' });
  return;
}
//Extract the token — the header looks like "Bearer <token>", so split on " " and take index [1]
  const token = authHeader.split(" ")[1];

// Call verifyAccessToken(token) from authService
// 5. Attach the result to req.user
try{
  req.user = verifyAccessToken(token);
  next();
}
catch {
  res.status(401).json({error: 'Unauthorised' });
}
};