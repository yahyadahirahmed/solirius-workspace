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
        const { error } = await supabase.auth.signOut();
        
        if (error) {
          return sendError(res, 500, 'Logout failed', error.message);
        }
        
        return sendSuccess(res, { message: 'Logged out successfully' });
        
      default:
        return sendError(res, 405, 'Method not allowed');
    }
  } catch (error) {
    console.error('Logout Error:', error);
    return sendError(res, 500, 'Internal server error', error.message);
  }
}