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
        const { q: query } = req.query;
        
        if (!query) {
          return sendError(res, 400, 'Query parameter required');
        }
        
        // First get all employees, then filter by skills case-insensitively
        const baseWhere = {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { currentRole: { contains: query, mode: 'insensitive' } },
            { currentProject: { contains: query, mode: 'insensitive' } },
            { about: { contains: query, mode: 'insensitive' } }
          ]
        };

        // Get employees matching text fields
        const textMatches = await prisma.employee.findMany({
          where: baseWhere,
          include: {
            previousExperiences: true
          },
          orderBy: { name: 'asc' }
        });

        // Get employees with matching skills (case-insensitive)
        const allEmployees = await prisma.employee.findMany({
          include: {
            previousExperiences: true
          }
        });

        const skillMatches = allEmployees.filter(emp => 
          emp.skillTags.some(skill => 
            skill.toLowerCase().includes(query.toLowerCase())
          )
        );

        // Combine and deduplicate results
        const combinedResults = [...textMatches];
        skillMatches.forEach(skillMatch => {
          if (!combinedResults.find(existing => existing.id === skillMatch.id)) {
            combinedResults.push(skillMatch);
          }
        });

        // Sort by name
        const employees = combinedResults.sort((a, b) => a.name.localeCompare(b.name));
        
        const result = {
          employees,
          total: employees.length
        };
        
        return sendSuccess(res, result);
        
      default:
        return sendError(res, 405, 'Method not allowed');
    }
  } catch (error) {
    console.error('API Error:', error);
    return sendError(res, 500, 'Internal server error', error.message);
  }
}