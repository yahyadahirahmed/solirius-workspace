import { getPrismaClient, handleCors, sendError, sendSuccess } from '../../lib/api-utils.js';

const prisma = getPrismaClient();

export default async function handler(req, res) {
  // Handle CORS
  if (handleCors(req, res)) {
    return;
  }

  try {
    switch (req.method) {
      case 'GET':
        // Get all employees
        const employees = await prisma.employee.findMany({
          include: {
            previousExperiences: true
          },
          orderBy: { name: 'asc' }
        });

        if (!employees) {
          return sendError(res, 404, 'No employees found');
        }

        return sendSuccess(res, {
          employees, // Array is nested inside 'employees' property to match existing frontend expectation
        });

      case 'POST':
        // Create employee
        const body = req.body;
        
        const employee = await prisma.employee.create({
          data: {
            ...body,
            previousExperiences: {
              create: body.previousExperiences || []
            }
          },
          include: {
            previousExperiences: true
          }
        });
        
        return sendSuccess(res, employee, 201);
        
      default:
        return sendError(res, 405, 'Method not allowed');
    }
  } catch (error) {
    console.error('API Error:', error);
    return sendError(res, 500, 'Internal server error', error.message);
  }
}