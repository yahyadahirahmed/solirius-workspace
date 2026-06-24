import { Router, Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';
import { sendWelcomeEmail } from '../services/emailService';
import crypto from 'node:crypto';
import bcrypt from 'bcrypt';

const router = Router();

// GET /api/employees
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const employees = await prisma.employee.findMany({
      include: { previousExperiences: true },
      orderBy: { name: 'asc' },
    });
    res.json({ employees });
  } catch (err) {
    next(err);
  }
});

// GET /api/employees/search?q=query  — must be above /:id
router.get('/search', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = req.query.q as string;

    if (!query) {
      res.status(400).json({ error: 'Query parameter q is required' });
      return;
    }

    const employees = await prisma.employee.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { currentRole: { contains: query, mode: 'insensitive' } },
          { currentProject: { contains: query, mode: 'insensitive' } },
          { about: { contains: query, mode: 'insensitive' } },
          { skillTags: { hasSome: [query] } },
        ],
      },
      include: { previousExperiences: true },
      orderBy: { name: 'asc' },
    });

    res.json({ employees, total: employees.length });
  } catch (err) {
    next(err);
  }
});

// GET /api/employees/:id
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id as string);

    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid employee ID' });
      return;
    }

    const employee = await prisma.employee.findUnique({
      where: { id },
      include: { previousExperiences: true },
    });

    if (!employee) {
      res.status(404).json({ error: 'Employee not found' });
      return;
    }

    res.json(employee);
  } catch (err) {
    next(err);
  }
});

// PUT /api/employees/:id
router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id as string);

    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid employee ID' });
      return;
    }

    const { previousExperiences, password: _pw, ...employeeData } = req.body;

    const processedExperiences = (previousExperiences ?? []).map((exp: any) => {
      const { id: _id, employeeId: _empId, createdAt: _ca, updatedAt: _ua, ...clean } = exp;
      return {
        ...clean,
        startDate: new Date(clean.startDate).toISOString(),
        endDate: new Date(clean.endDate).toISOString(),
      };
    });

    const updated = await prisma.employee.update({
      where: { id },
      data: {
        ...employeeData,
        previousExperiences: {
          deleteMany: {},
          create: processedExperiences,
        },
      },
      include: { previousExperiences: true },
    });

    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// POST /api/employees
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { previousExperiences, password: _pw, ...employeeData } = req.body;

    const plainPassword = crypto.randomBytes(8).toString('hex');
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const processedExperiences = (previousExperiences ?? []).map((exp: any) => {
      const { id: _id, employeeId: _empId, createdAt: _ca, updatedAt: _ua, ...clean } = exp;
      return {
        ...clean,
        startDate: new Date(clean.startDate).toISOString(),
        endDate: new Date(clean.endDate).toISOString(),
      };
    });

    const employee = await prisma.employee.create({
      data: {
        ...employeeData,
        password: hashedPassword,
        previousExperiences: { create: processedExperiences },
      },
      include: { previousExperiences: true },
    });

    await sendWelcomeEmail(employee.email, employee.name, plainPassword);

    res.status(201).json(employee);
  } catch (err) {
    next(err);
  }
});

export default router;
