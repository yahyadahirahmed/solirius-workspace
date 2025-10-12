import { getSupabaseClient, handleCors, sendError, sendSuccess } from '../../lib/api-utils.js';

const supabase = getSupabaseClient();

export default async function handler(req, res) {
  // Handle CORS
  if (handleCors(req, res)) {
    return;
  }

  try {
    switch (req.method) {
      case 'POST':
        const { email, password } = req.body;
        
        if (!email || !password) {
          return sendError(res, 400, 'Email and password are required');
        }
        
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) {
          return sendError(res, 401, 'Invalid credentials', error.message);
        }
        
        return sendSuccess(res, {
          user: data.user,
          session: data.session,
        });
        
      default:
        return sendError(res, 405, 'Method not allowed');
    }
  } catch (error) {
    console.error('Auth Error:', error);
    return sendError(res, 500, 'Internal server error', error.message);
  }
}