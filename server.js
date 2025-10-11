import { createServer } from 'http';
import { URL } from 'url';
import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient({
  log: ['error'],
});

// Supabase client for server-side operations
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Use service role for admin operations
);

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
        if (pathname === '/api/employees/search') {
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
          const employees = combinedResults.sort((a, b) => a.name.localeCompare(b.name));
          
          const result = {
            employees,
            total: employees.length
          };
          
          res.writeHead(200, corsHeaders);
          res.end(JSON.stringify(result));
        } else if (pathname.startsWith('/api/employees/by-supabase-id/')) {
          // Get employee by Supabase user ID
          const supabaseUserId = pathname.split('/')[4];
          
          const employee = await prisma.employee.findUnique({
            where: { supabaseUserId },
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
        } else if (pathname.startsWith('/api/employees/')) {
          // Get single employee by ID - CHECK THIS BEFORE the exact /api/employees
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
        } else if (pathname === '/api/employees') {
          // Get all employees - CHECK THIS LAST
          const employees = await prisma.employee.findMany({
            include: {
              previousExperiences: true
            },
            orderBy: { name: 'asc' }
          });

          if(!employees) {
            res.writeHead(404, corsHeaders);
            res.end(JSON.stringify({ error: 'No employees found' }));
            return;
          }

          res.writeHead(200, corsHeaders);
          res.end(JSON.stringify({
            employees,        // ← Array is nested inside 'employees' property
          }));
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

// Authentication routes
// async function handleAuth(req, res, pathname) {
//   try {
//     if (pathname === '/api/auth/signup' && req.method === 'POST') {
//       // Signup endpoint - creates both Supabase user and employee record
//       const body = await parseBody(req);
//       const { email, password, employeeData } = body;

//       if (!email || !password || !employeeData) {
//         res.end(JSON.stringify({ 
//           error: 'Email, password, and employeeData required' 
//         }));
//         return;
//       }

//       try {
//         // 1. Create Supabase auth user
//         const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
//           email,
//           password,
//           user_metadata: {
//             full_name: employeeData.name,
//             role: employeeData.currentRole
//           },
//           email_confirm: true
//         });

//         if (!user) {
//           res.writeHead(401, corsHeaders);
//           res.end(JSON.stringify({ error: 'Invalid session' }));
//           return;
//         }

//         // 2. Create employee record in database
//         const { previousExperiences, ...employeeInfo } = employeeData;
        
//         const employee = await prisma.employee.create({
//           data: {
//             ...employeeInfo,
//             email,
//             password, // You might want to hash this differently
//             supabaseUserId: authUser.user.id,
//             previousExperiences: {
//               create: previousExperiences || []
//             }
//           },
//           include: {
//             previousExperiences: true
//           }
//         });

//         // Remove password from response
//         const { password: _, ...employeeResponse } = employee;

//         res.writeHead(201, corsHeaders);
//         res.end(JSON.stringify({ 
//           message: 'User created successfully',
//           user: authUser.user,
//           employee: employeeResponse
//         }));

//       } catch (dbError) {
//         // If employee creation fails, we should clean up the Supabase user
//         if (authUser?.user?.id) {
//           await supabase.auth.admin.deleteUser(authUser.user.id);
//         }
        
//         res.writeHead(500, corsHeaders);
//         res.end(JSON.stringify({ 
//           error: 'Failed to create employee record',
//           details: dbError.message 
//         }));
//       }

//     } else {
//       res.writeHead(405, corsHeaders);
//       res.end(JSON.stringify({ error: 'Method not allowed' }));
//     }
//   } catch (error) {
//     console.error('Auth Error:', error);
//     res.writeHead(500, corsHeaders);
//     res.end(JSON.stringify({ error: 'Internal server error' }));
//   }
// }

// Add this function for handling skill search by user ID
async function handleSkillSearch(req, res, pathname) {
  try {
    // Extract user ID from pathname
    const parts = pathname.split('/');
    const userId = parts[parts.length - 1]; // Assuming user ID is the last part

    if (!userId) {
      res.writeHead(400, corsHeaders);
      res.end(JSON.stringify({ error: 'User ID is required' }));
      return;
    }

    // Find employee by user ID
    const employee = await prisma.employee.findUnique({
      where: { supabaseUserId: userId },
      include: {
        previousExperiences: true
      }
    });

    if (!employee) {
      res.writeHead(404, corsHeaders);
      res.end(JSON.stringify({ error: 'Employee not found' }));
      return;
    }

    // Return just the skill tags array (not wrapped in an object)
    res.writeHead(200, corsHeaders);
    res.end(JSON.stringify(employee.skillTags || []));
  } catch (error) {
    console.error('SkillSearch Error:', error);
    res.writeHead(500, corsHeaders);
    res.end(JSON.stringify({ error: 'Internal server error' }));
  }
}

// Helper function to parse cookies
// function parseCookies(cookieHeader) {
//   const cookies = {};
//   if (cookieHeader) {
//     cookieHeader.split(';').forEach(cookie => {
//       const [name, value] = cookie.trim().split('=');
//       if (name && value) {
//         cookies[name] = decodeURIComponent(value);
//       }
//     });
//   }
//   return cookies;
// }

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
  } else if (pathname.startsWith('/api/skillSearch/')) {
    // Handle skill search by user ID
    await handleSkillSearch(req, res, pathname);
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
  // console.log(`🚀 API Server running on http://localhost:${PORT}`);
  // console.log('📚 Available endpoints:');
  // console.log('  GET /api/employees - Get all employees');
  // console.log('  GET /api/employees/:id - Get employee by ID');
  // console.log('  GET /api/employees/search?q=query - Search employees');
  // console.log('  POST /api/auth/login - Login with email/password');
  // console.log('  POST /api/auth/logout - Logout');
  // console.log('  GET /api/auth/me - Get current user');
  // console.log('  GET /api/skill-tags - Get all skill tags');
  // console.log('  GET /api/health - Health check');
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