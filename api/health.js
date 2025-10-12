import { handleCors, sendSuccess } from '../../lib/api-utils.js';

export default async function handler(req, res) {
  // Handle CORS
  if (handleCors(req, res)) {
    return;
  }

  if (req.method === 'GET') {
    return sendSuccess(res, { 
      status: 'ok', 
      timestamp: new Date().toISOString() 
    });
  }
  
  return res.status(405).json({ error: 'Method not allowed' });
}