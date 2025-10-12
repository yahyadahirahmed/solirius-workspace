import { getSupabaseClient, handleCors, sendError, sendSuccess } from '../../lib/api-utils.js';

const supabase = getSupabaseClient();

export default async function handler(req, res) {
  // Handle CORS
  if (handleCors(req, res)) {
    return;
  }

  try {
    switch (req.method) {
      case 'GET':
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return sendError(res, 401, 'No valid authorization header found');
        }
        
        const token = authHeader.split(' ')[1];
        
        const { data: { user }, error } = await supabase.auth.getUser(token);
        
        if (error || !user) {
          return sendError(res, 401, 'Invalid or expired token');
        }
        
        return sendSuccess(res, { user });
        
      default:
        return sendError(res, 405, 'Method not allowed');
    }
  } catch (error) {
    console.error('Auth Me Error:', error);
    return sendError(res, 500, 'Internal server error', error.message);
  }
}