import { getPrismaClient, handleCors, sendError, sendSuccess } from '../../../lib/api-utils.js';

const prisma = getPrismaClient();

export default async function handler(req, res) {
  // Handle CORS
  if (handleCors(req, res)) {
    return;
  }

  const { id: supabaseUserId } = req.query;

  try {
    switch (req.method) {
      case 'GET':
        // Get employee by Supabase user ID
        if (!supabaseUserId) {
          return sendError(res, 400, 'Supabase user ID is required');
        }
        
        const employee = await prisma.employee.findUnique({
          where: { supabaseUserId },
          include: {
            previousExperiences: true
          }
        });
        
        if (!employee) {
          return sendError(res, 404, 'Employee not found');
        }
        
        return sendSuccess(res, employee);
        
      default:
        return sendError(res, 405, 'Method not allowed');
    }
  } catch (error) {
    console.error('API Error:', error);
    return sendError(res, 500, 'Internal server error', error.message);
  }
}