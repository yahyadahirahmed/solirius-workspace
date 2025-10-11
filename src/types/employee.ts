// Types generated from Prisma schema
export type Location = 'LONDON' | 'MANCHESTER';

export interface Employee {
  id: number;
  name: string;
  currentRole: string;
  currentProject: string;
  email: string;
  location: Location;
  about: string;
  skillTags: string[];
  createdAt: Date;
  updatedAt: Date;
  previousExperiences?: PreviousExperience[];
}

export interface PreviousExperience {
  id: number;
  role: string;
  project: string;
  startDate: Date;
  endDate: Date;
  description: string;
  employeeId: number;
  employee?: Employee;
  createdAt: Date;
  updatedAt: Date;
}

// Input types for creating/updating
export interface CreateEmployeeInput {
  name: string;
  currentRole: string;
  currentProject: string;
  email: string;
  location: Location;
  about: string;
  skillTags: string[];
}

export interface UpdateEmployeeInput {
  name?: string;
  currentRole?: string;
  currentProject?: string;
  email?: string;
  location?: Location;
  about?: string;
  skillTags?: string[];
}

export interface CreatePreviousExperienceInput {
  role: string;
  project: string;
  startDate: Date;
  endDate: Date;
  description: string;
  employeeId: number;
}

export interface UpdatePreviousExperienceInput {
  role?: string;
  project?: string;
  startDate?: Date;
  endDate?: Date;
  description?: string;
}

// Search result types
export interface EmployeeSearchResult {
  employees: Employee[];
  total: number;
}