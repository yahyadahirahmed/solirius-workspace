import { createServer } from 'http';
import { URL } from 'url';
import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { Resend } from 'resend';

dotenv.config();

const prisma = new PrismaClient({
  log: ['error'],
});

// Supabase client for server-side operations
const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Use service role for admin operations
);

// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY);

const PORT = process.env.PORT || process.env.API_PORT || 3001;

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
  'Access-Control-Allow-Origin': '*', // Allow all origins for now
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true',
  'Content-Type': 'application/json'
};

// function that sends email using Resend
const sendWelcomeEmail = async (email, name) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Solirius Directory <onboarding@resend.dev>', // Use resend.dev for testing
      to: [email],
      subject: 'Welcome to Solirius Employee Directory!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #1a73e8; color: white; padding: 20px; text-align: center;">
            <h1>Welcome to Solirius Directory!</h1>
          </div>
          <div style="padding: 20px;">
            <h2>Hi ${name}!</h2>
            <p>Your employee profile has been successfully created.</p>
            
            <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3>Login Credentials:</h3>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Password:</strong> 123</p>
            </div>
            
            <p><a href="https://solirius-workspace-3wutpj5sj-yahyas-projects-50573c44.vercel.app/login" style="background: #1a73e8; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Login to Your Profile</a></p>
            
            <p>You can update your password after logging in.</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('❌ Email error:', error);
      return false;
    }

    console.log('✅ Email sent successfully:', data);
    return true;
  } catch (error) {
    console.error('❌ Failed to send email:', error);
    return false;
  }
};

// random string generator
function generateRandomString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}
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
            select: { id: true } // Only select the ID field
          });
          
          if (!employee) {
            res.writeHead(404, corsHeaders);
            res.end(JSON.stringify({ error: 'Employee not found' }));
            return;
          }
          
          res.writeHead(200, corsHeaders);
          res.end(JSON.stringify(employee.id)); // Return just the ID number
        } 
        else if (pathname.startsWith('/api/employees/')) {
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

      case 'PUT':
        if (pathname.startsWith('/api/employees/')) {
          // Update employee
          const id = parseInt(pathname.split('/')[3]);
          const body = await parseBody(req);
          
          const existingEmployee = await prisma.employee.findUnique({
            where: { id },
            include: { previousExperiences: true }
          });
          
          if (!existingEmployee) {
            res.writeHead(404, corsHeaders);
            res.end(JSON.stringify({ error: 'Employee not found' }));
            return;
          }
          
          // Process experiences with proper date handling
          const processedExperiences = (body.previousExperiences || []).map(exp => {
            const processedExp = { ...exp };
            
            // Remove fields that shouldn't be passed to Prisma create
            delete processedExp.id;
            delete processedExp.employeeId;
            delete processedExp.createdAt;
            delete processedExp.updatedAt;
            
            // Convert date strings to proper DateTime format
            if (processedExp.startDate) {
              processedExp.startDate = new Date(processedExp.startDate).toISOString();
            }
            if (processedExp.endDate) {
              processedExp.endDate = new Date(processedExp.endDate).toISOString();
            }
            
            return processedExp;
          });

          // Update employee data
          const updatedEmployee = await prisma.employee.update({
            where: { id },
            data: {
              ...body,
              previousExperiences: {
                deleteMany: {}, // Remove existing experiences
                create: processedExperiences // Add new experiences with proper dates
              }
            },
            include: { previousExperiences: true }
          });
          
          res.writeHead(200, corsHeaders);
          res.end(JSON.stringify(updatedEmployee));
        }
        break;
        
      case 'POST':
        if (pathname === '/api/employees') {
          // Create employee
          const body = await parseBody(req);
          
          try {
            // Create Supabase user with email and default password
            const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
              email: body.email,
              password: generateRandomString(6), // Default password
              email_confirm: true // Auto-confirm the email
            });

            if (authError && authError.message !== 'User already registered') {
              console.error('Supabase auth error:', authError);
              res.writeHead(400, corsHeaders);
              res.end(JSON.stringify({ error: 'Failed to create user account: ' + authError.message }));
              return;
            }

            // Get the Supabase user ID (either newly created or existing)
            let supabaseUserId = authUser?.user?.id;
            
            // If user already exists, get their ID
            if (authError && authError.message === 'User already registered') {
              const { data: existingUser } = await supabase.auth.admin.listUsers();
              const foundUser = existingUser?.users?.find(user => user.email === body.email);
              supabaseUserId = foundUser?.id;
            }

            if (!supabaseUserId) {
              res.writeHead(400, corsHeaders);
              res.end(JSON.stringify({ error: 'Failed to get user ID from Supabase' }));
              return;
            }
          
            // Process experiences with proper date handling for creation
            const processedExperiences = (body.previousExperiences || []).map(exp => {
              const processedExp = { ...exp };
              
              // Remove the 'id' field as it's auto-generated by Prisma
              delete processedExp.id;
              delete processedExp.employeeId;
              delete processedExp.createdAt;
              delete processedExp.updatedAt;
              
              // Convert date strings to proper DateTime format
              if (processedExp.startDate) {
                processedExp.startDate = new Date(processedExp.startDate).toISOString();
              }
              if (processedExp.endDate) {
                processedExp.endDate = new Date(processedExp.endDate).toISOString();
              }
              
              return processedExp;
            });
            
            // Create employee record with Supabase user ID
            const { supabaseUserId: bodySupabaseUserId, ...cleanBody } = body; // Remove any existing supabaseUserId from body
            
            const employee = await prisma.employee.create({
              data: {
                ...cleanBody,
                supabaseUserId: supabaseUserId, // Link to Supabase user
                previousExperiences: {
                  create: processedExperiences
                }
              },
              include: {
                previousExperiences: true
              }
            });

            // Send welcome email
            console.log('📧 Sending welcome email to:', employee.email);
            const emailSent = await sendWelcomeEmail(employee.email, employee.name);

            if (!emailSent) {
              console.warn('⚠️ Email failed to send, but employee was created successfully');
            }

            res.writeHead(201, corsHeaders);
            res.end(JSON.stringify(employee));
          } catch (error) {
            console.error('Error creating employee:', error);
            res.writeHead(500, corsHeaders);
            res.end(JSON.stringify({ error: 'Failed to create employee profile' }));
          }
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
  } else if (pathname.startsWith('/api/skillSearch/')) {
    // Handle skill search by user ID
    await handleSkillSearch(req, res, pathname);
  } else if (pathname === '/api/getEmployeeBySupabaseId/') { 
    await getEmployeeDBId(req, res);
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