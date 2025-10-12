import { getPrismaClient, handleCors, sendError, sendSuccess } from '../../lib/api-utils.js';

const prisma = getPrismaClient();

export default async function handler(req, res) {
  // Handle CORS
  if (handleCors(req, res)) {
    return;
  }

  const { id } = req.query;

  try {
    switch (req.method) {
      case 'GET':
        // Get single employee by ID
        const employeeId = parseInt(id);
        
        if (isNaN(employeeId)) {
          return sendError(res, 400, 'Invalid employee ID');
        }
        
        const employee = await prisma.employee.findUnique({
          where: { id: employeeId },
          include: {
            previousExperiences: true
          }
        });
        
        if (!employee) {
          return sendError(res, 404, 'Employee not found');
        }
        
        return sendSuccess(res, employee);

      case 'PUT':
        // Update employee
        const updateEmployeeId = parseInt(id);
        
        if (isNaN(updateEmployeeId)) {
          return sendError(res, 400, 'Invalid employee ID');
        }
        
        const updateData = req.body;
        
        const updatedEmployee = await prisma.employee.update({
          where: { id: updateEmployeeId },
          data: {
            ...updateData,
            previousExperiences: updateData.previousExperiences ? {
              deleteMany: {},
              create: updateData.previousExperiences
            } : undefined
          },
          include: {
            previousExperiences: true
          }
        });
        
        return sendSuccess(res, updatedEmployee);

      case 'DELETE':
        // Delete employee
        const deleteId = parseInt(id);
        
        if (isNaN(deleteId)) {
          return sendError(res, 400, 'Invalid employee ID');
        }
        
        await prisma.employee.delete({
          where: { id: deleteId }
        });
        
        return sendSuccess(res, { message: 'Employee deleted successfully' });
        
      default:
        return sendError(res, 405, 'Method not allowed');
    }
  } catch (error) {
    console.error('API Error:', error);
    return sendError(res, 500, 'Internal server error', error.message);
  }
}