import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import prisma from '../lib/prisma';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../services/authService';
import { requireAuth } from '../middleware/requireAuth';
import { AuthenticatedRequest } from '../types/index';

const router = Router();

// POST /api/auth/login
// 1. Pull email + password from req.body
// 2. Find employee by email in DB — if not found, 401
// 3. bcrypt.compare(password, employee.password) — if no match, 401
// 4. Generate access token + refresh token
// 5. Set refresh token as httpOnly cookie
// 6. Return { accessToken, employee } — strip password from employee
router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const employee = await prisma.employee.findUnique({ where: { email } });
    if (!employee) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const match = await bcrypt.compare(password, employee.password);
    if (!match) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const payload = { employeeId: employee.id, email: employee.email };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const { password: _, ...safeEmployee } = employee;
    res.json({ accessToken, employee: safeEmployee });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/refresh
// 1. Read req.cookies.refreshToken — if missing, 401
// 2. verifyRefreshToken(token) — if throws, 401
// 3. Generate new access token from the decoded payload
// 4. Return { accessToken }
router.post('/refresh', async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;
  if (!token) {
    res.status(401).json({ error: 'No refresh token' });
    return;
  }

  try {
    const payload = verifyRefreshToken(token);
    const accessToken = generateAccessToken({ employeeId: payload.employeeId, email: payload.email });
    res.json({ accessToken });
  } catch {
    res.status(401).json({ error: 'Invalid or expired refresh token' });
  }
});

// POST /api/auth/logout
// 1. Clear the refreshToken cookie (set Max-Age to 0)
// 2. Return 200
router.post('/logout', (_req: Request, res: Response) => {
  res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'strict' });
  res.json({ message: 'Logged out' });
});

// GET /api/auth/me
// 1. requireAuth runs first — req.user is already set if we get here
// 2. Fetch full employee from DB using req.user.employeeId
// 3. Return employee without password
router.get('/me', requireAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const employee = await prisma.employee.findUnique({
      where: { id: req.user!.employeeId },
    });
    if (!employee) {
      res.status(404).json({ error: 'Employee not found' });
      return;
    }
    const { password: _, ...safeEmployee } = employee;
    res.json(safeEmployee);
  } catch (err) {
    next(err);
  }
});

export default router;
