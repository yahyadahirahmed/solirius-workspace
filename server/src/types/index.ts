import { Request } from 'express';

// ─── Auth ────────────────────────────────────────────
// The payload encoded inside the JWT token.
// This is what jwt.sign() receives and what jwt.verify() returns.

export interface AuthPayload {
  employeeId: number;
  email: string;
}

// Express Request extended with the decoded JWT payload.
// Used in route handlers that sit behind the requireAuth middleware.

export interface AuthenticatedRequest extends Request {
  user?: AuthPayload;
}

// ─── Request Bodies ──────────────────────────────────
// These mirror what the frontend sends in POST/PUT request bodies.

export interface LoginBody {
  email: string;
  password: string;
}

export interface RegisterBody {
  name: string;
  email: string;
  password: string;
  currentRole: string;
  currentProject: string;
  location: 'LONDON' | 'MANCHESTER';
  about: string;
  skillTags: string[];
}

export interface UpdateEmployeeBody {
  name?: string;
  currentRole?: string;
  currentProject?: string;
  location?: 'LONDON' | 'MANCHESTER';
  about?: string;
  skillTags?: string[];
  previousExperiences?: ExperienceInput[];
}

export interface ExperienceInput {
  role: string;
  project: string;
  startDate: string; // ISO date string from frontend
  endDate: string;   // ISO date string from frontend
  description: string;
}

// ─── Service Return Types ────────────────────────────
// Used by auth.service.ts to type what login/register return.

export interface AuthResponse {
  token: string;
  employee: {
    id: number;
    name: string;
    email: string;
    currentRole: string;
  };
}