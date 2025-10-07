import { createServer } from 'http';
import { URL } from 'url';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const PORT = process.env.API_PORT || 3001;

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json'
};

// Parse JSON body
async function parseBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        resolve({});
      }
    });
  });
}

// Employee routes handler
async function handleEmployees(req, res, pathname, searchParams) {
  try {
    switch (req.method) {
      case 'GET':
        if (pathname === '/api/employees') {
          // Get all employees
          const location = searchParams.get('location');
          const skillTags = searchParams.get('skillTags');
          
          const where = {};
          if (location) where.location = location;
          if (skillTags) where.skillTags = { hasSome: skillTags.split(',') };
          
          const employees = await prisma.employee.findMany({
            where,
            include: {
              previousExperiences: true
            },
            orderBy: { name: 'asc' }
          });
          
          res.writeHead(200, corsHeaders);
          res.end(JSON.stringify(employees));
        } else if (pathname.startsWith('/api/employees/')) {
          // Get single employee
          const id = parseInt(pathname.split('/')[3]);
          
          const employee = await prisma.employee.findUnique({
            where: { id },
            include: {
              previousExperiences: true
            }
          });
          
          if (!employee) {
            res.writeHead(404, corsHeaders);
            res.end(JSON.stringify({ error: 'Employee not found' }));
            return;
          }
          
          res.writeHead(200, corsHeaders);
          res.end(JSON.stringify(employee));
        } else if (pathname === '/api/employees/search') {
          // Search employees
          const query = searchParams.get('q');
          const location = searchParams.get('location');
          const page = parseInt(searchParams.get('page') || '1');
          const limit = parseInt(searchParams.get('limit') || '10');
          
          if (!query) {
            res.writeHead(400, corsHeaders);
            res.end(JSON.stringify({ error: 'Query parameter required' }));
            return;
          }
          
          const where = {
            OR: [
              { name: { contains: query, mode: 'insensitive' } },
              { currentRole: { contains: query, mode: 'insensitive' } },
              { currentProject: { contains: query, mode: 'insensitive' } },
              { about: { contains: query, mode: 'insensitive' } },
              { skillTags: { hasSome: [query] } }
            ]
          };
          
          if (location) {
            where.location = location;
          }
          
          const [employees, total] = await Promise.all([
            prisma.employee.findMany({
              where,
              include: {
                previousExperiences: true
              },
              skip: (page - 1) * limit,
              take: limit,
              orderBy: { name: 'asc' }
            }),
            prisma.employee.count({ where })
          ]);
          
          const result = {
            employees,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
          };
          
          res.writeHead(200, corsHeaders);
          res.end(JSON.stringify(result));
        }
        break;
        
      case 'POST':
        if (pathname === '/api/employees') {
          // Create employee
          const body = await parseBody(req);
          
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
          
          res.writeHead(201, corsHeaders);
          res.end(JSON.stringify(employee));
        }
        break;
        
      default:
        res.writeHead(405, corsHeaders);
        res.end(JSON.stringify({ error: 'Method not allowed' }));
    }
  } catch (error) {
    console.error('API Error:', error);
    res.writeHead(500, corsHeaders);
    res.end(JSON.stringify({ error: 'Internal server error' }));
  }
}

// Skill tags routes
async function handleSkillTags(req, res) {
  try {
    if (req.method === 'GET') {
      const employees = await prisma.employee.findMany({
        select: { skillTags: true }
      });
      
      const allSkills = employees.flatMap(emp => emp.skillTags);
      const uniqueSkills = [...new Set(allSkills)].sort();
      
      res.writeHead(200, corsHeaders);
      res.end(JSON.stringify(uniqueSkills));
    } else {
      res.writeHead(405, corsHeaders);
      res.end(JSON.stringify({ error: 'Method not allowed' }));
    }
  } catch (error) {
    console.error('API Error:', error);
    res.writeHead(500, corsHeaders);
    res.end(JSON.stringify({ error: 'Internal server error' }));
  }
}

// Main request handler
const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = url.pathname;
  const searchParams = url.searchParams;
  
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, corsHeaders);
    res.end();
    return;
  }
  
  console.log(`${req.method} ${pathname}`);
  
  // Route handling
  if (pathname.startsWith('/api/employees')) {
    await handleEmployees(req, res, pathname, searchParams);
  } else if (pathname === '/api/skill-tags') {
    await handleSkillTags(req, res);
  } else if (pathname === '/api/health') {
    res.writeHead(200, corsHeaders);
    res.end(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }));
  } else {
    res.writeHead(404, corsHeaders);
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

// Start server
server.listen(PORT, () => {
  console.log(`🚀 API Server running on http://localhost:${PORT}`);
  console.log('📚 Available endpoints:');
  console.log('  GET /api/employees - Get all employees');
  console.log('  GET /api/employees/:id - Get employee by ID');
  console.log('  GET /api/employees/search?q=query - Search employees');
  console.log('  GET /api/skill-tags - Get all skill tags');
  console.log('  GET /api/health - Health check');
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('🔄 Shutting down gracefully...');
  await prisma.$disconnect();
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});