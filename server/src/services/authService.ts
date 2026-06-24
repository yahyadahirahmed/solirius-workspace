import jwt from 'jsonwebtoken';
import { AuthPayload } from '../types/index';


// generateAccessToken
// - takes an AuthPayload (id + email)
// - signs it with JWT_SECRET from process.env
// - expires in 15 minutes
// - returns the signed token string


export const generateAccessToken = (payload: AuthPayload): string => {
  return jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '15m' });
};


// generateRefreshToken
// - same shape as above but uses JWT_REFRESH_SECRET
// - expires in 7 days
// - returns the signed token string


export const generateRefreshToken = (payload: AuthPayload): string => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET as string, { expiresIn: '7d' });
};

// verifyAccessToken
// - takes a token string
// - verifies it against JWT_SECRET
// - returns the decoded AuthPayload if valid
// - throws if the token is invalid or expired (jwt.verify already throws — let it)

export const  verifyAccessToken = ( token: string): AuthPayload => {
    return jwt.verify(token, process.env.JWT_SECRET as string) as AuthPayload
}

// verifyRefreshToken
// - same but uses JWT_REFRESH_SECRET

export const  verifyRefreshToken = ( token: string): AuthPayload => {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET as string) as AuthPayload
}