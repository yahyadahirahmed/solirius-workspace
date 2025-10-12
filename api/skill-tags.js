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
        // Get all unique skill tags from all employees
        const employees = await prisma.employee.findMany({
          select: {
            skillTags: true
          }
        });
        
        // Flatten and deduplicate skill tags
        const allSkillTags = employees.flatMap(emp => emp.skillTags);
        const uniqueSkillTags = [...new Set(allSkillTags)].sort();
        
        return sendSuccess(res, uniqueSkillTags);
        
      default:
        return sendError(res, 405, 'Method not allowed');
    }
  } catch (error) {
    console.error('API Error:', error);
    return sendError(res, 500, 'Internal server error', error.message);
  }
}