import { Request, Response, NextFunction } from 'express';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error('❌ Server error:', err.message);
  res.status(500).json({ error: err.message });
}