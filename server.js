import { createServer } from 'http';
import { URL } from 'url';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['error'],
});
const PORT = process.env.API_PORT || 3001;

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🔄 Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🔄 Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': 'http://localhost:8080',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true',
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
    console.log('handleEmployees called with:', { method: req.method, pathname });
    
    switch (req.method) {
      case 'GET':
        if (pathname === '/api/employees') {
          console.log('Getting all employees...');
          // Get all employees
          const location = searchParams.get('location');
          const skillTags = searchParams.get('skillTags');
          
          const where = {};
          if (location) where.location = location;
          if (skillTags) where.skillTags = { hasSome: skillTags.split(',') };
          
          console.log('Querying with where:', where);
          
          const employees = await prisma.employee.findMany({
            where,
            include: {
              previousExperiences: true
            },
            orderBy: { name: 'asc' }
          });
          
          console.log('Found employees:', employees.length);
          res.writeHead(200, corsHeaders);
          res.end(JSON.stringify(employees));
          return;
        } else if (pathname === '/api/employees/search') {
          // Search employees - CHECK THIS FIRST before the generic /api/employees/ handler
          const query = searchParams.get('q');
          
          if (!query) {
            res.writeHead(400, corsHeaders);
            res.end(JSON.stringify({ error: 'Query parameter required' }));
            return;
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
          const employees = combinedResults.sort((a, b) => a.name.localeCompare(b.name));          const result = {
            employees,
            total: employees.length
          };
          
          res.writeHead(200, corsHeaders);
          res.end(JSON.stringify(result));
        } else if (pathname.startsWith('/api/employees/')) {
          // Get single employee by ID
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

// Authentication routes
async function handleAuth(req, res, pathname) {
  try {
    if (pathname === '/api/auth/login' && req.method === 'POST') {
      // Login endpoint
      const body = await parseBody(req);
      const { email, password } = body;

      if (!email || !password) {
        res.writeHead(400, corsHeaders);
        res.end(JSON.stringify({ error: 'Email and password required' }));
        return;
      }

      // Find user by email
      const user = await prisma.employee.findUnique({
        where: { email }
      });

      if (!user || user.password !== password) {
        res.writeHead(401, corsHeaders);
        res.end(JSON.stringify({ error: 'Invalid credentials' }));
        return;
      }

      // Create session token (simple approach - in production use JWT or proper session store)
      const sessionToken = Buffer.from(`${user.id}:${Date.now()}`).toString('base64');

      // Set HTTP-only cookie
      const cookieHeader = `session=${sessionToken}; HttpOnly; Path=/; Max-Age=86400; SameSite=Strict${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`;
      
      // Return user data (excluding password)
      const { password: _, ...userWithoutPassword } = user;
      res.writeHead(200, {
        ...corsHeaders,
        'Set-Cookie': cookieHeader
      });
      res.end(JSON.stringify({ 
        user: userWithoutPassword,
        message: 'Login successful' 
      }));

    } else if (pathname === '/api/auth/logout' && req.method === 'POST') {
      // Logout endpoint - clear the cookie
      const cookieHeader = `session=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict`;
      
      res.writeHead(200, {
        ...corsHeaders,
        'Set-Cookie': cookieHeader
      });
      res.end(JSON.stringify({ message: 'Logout successful' }));

    } else if (pathname === '/api/auth/me' && req.method === 'GET') {
      // Get current user from session
      const cookies = parseCookies(req.headers.cookie || '');
      const sessionToken = cookies.session;

      if (!sessionToken) {
        res.writeHead(401, corsHeaders);
        res.end(JSON.stringify({ error: 'Not authenticated' }));
        return;
      }

      try {
        // Decode session token (simple approach)
        const decoded = Buffer.from(sessionToken, 'base64').toString();
        const [userId] = decoded.split(':');
        
        const user = await prisma.employee.findUnique({
          where: { id: parseInt(userId) }
        });

        if (!user) {
          res.writeHead(401, corsHeaders);
          res.end(JSON.stringify({ error: 'Invalid session' }));
          return;
        }

        const { password: _, ...userWithoutPassword } = user;
        res.writeHead(200, corsHeaders);
        res.end(JSON.stringify({ user: userWithoutPassword }));
      } catch (error) {
        res.writeHead(401, corsHeaders);
        res.end(JSON.stringify({ error: 'Invalid session' }));
      }

    } else {
      res.writeHead(405, corsHeaders);
      res.end(JSON.stringify({ error: 'Method not allowed' }));
    }
  } catch (error) {
    console.error('Auth Error:', error);
    res.writeHead(500, corsHeaders);
    res.end(JSON.stringify({ error: 'Internal server error' }));
  }
}

// Helper function to parse cookies
function parseCookies(cookieHeader) {
  const cookies = {};
  if (cookieHeader) {
    cookieHeader.split(';').forEach(cookie => {
      const [name, value] = cookie.trim().split('=');
      if (name && value) {
        cookies[name] = decodeURIComponent(value);
      }
    });
  }
  return cookies;
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
  try {
  // Route handling
  if (pathname.startsWith('/api/employees')) {
    await handleEmployees(req, res, pathname, searchParams);
  } else if (pathname.startsWith('/api/auth')) {
    await handleAuth(req, res, pathname);
  } else if (pathname === '/api/skill-tags') {
    await handleSkillTags(req, res);
  } else if (pathname === '/api/health') {
    res.writeHead(200, corsHeaders);
    res.end(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }));
  } else {
    res.writeHead(404, corsHeaders);
    res.end(JSON.stringify({ error: 'Not found' }));
  }
} catch (error) {
    console.error('Server Error:', error);
    res.writeHead(500, corsHeaders);
    res.end(JSON.stringify({ error: 'Internal server error', details: error.message }));
  }
});

// Start server
server.listen(PORT, () => {
  console.log(`🚀 API Server running on http://localhost:${PORT}`);
  console.log('📚 Available endpoints:');
  console.log('  GET /api/employees - Get all employees');
  console.log('  GET /api/employees/:id - Get employee by ID');
  console.log('  GET /api/employees/search?q=query - Search employees');
  console.log('  POST /api/auth/login - Login with email/password');
  console.log('  POST /api/auth/logout - Logout');
  console.log('  GET /api/auth/me - Get current user');
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