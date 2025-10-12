import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';

// Global Prisma client for serverless functions
let prisma;

export function getPrismaClient() {
  if (!prisma) {
    prisma = new PrismaClient({
      log: ['error'],
    });
  }
  return prisma;
}

// Supabase client for server-side operations
export function getSupabaseClient() {
  return createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

// CORS headers for all API routes
export const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL || 'https://your-vercel-app.vercel.app'
    : 'http://localhost:8080',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true',
  'Content-Type': 'application/json'
};

// Error response helper
export function sendError(res, statusCode, message, details = null) {
  res.status(statusCode).json({ 
    error: message,
    ...(details && { details })
  });
}

// Success response helper
export function sendSuccess(res, data, statusCode = 200) {
  res.status(statusCode).json(data);
}

// Handle CORS preflight
export function handleCors(req, res) {
  // Set CORS headers
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return true;
  }
  
  return false;
}