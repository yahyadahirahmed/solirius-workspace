import { prisma } from '@/lib/prisma';
import type { 
  Employee, 
  PreviousExperience, 
  CreateEmployeeInput, 
  UpdateEmployeeInput,
  CreatePreviousExperienceInput,
  UpdatePreviousExperienceInput,
  EmployeeSearchFilters,
  EmployeeSearchResult,
  Location
} from '@/types/employee';

export class EmployeeService {
  // Get all employees with optional filters
  async getAllEmployees(filters?: EmployeeSearchFilters): Promise<Employee[]> {
    try {
      const where: any = {};
      
      if (filters?.location) {
        where.location = filters.location;
      }
      
      if (filters?.currentRole) {
        where.currentRole = {
          contains: filters.currentRole,
          mode: 'insensitive'
        };
      }
      
      if (filters?.currentProject) {
        where.currentProject = {
          contains: filters.currentProject,
          mode: 'insensitive'
        };
      }
      
      if (filters?.skillTags && filters.skillTags.length > 0) {
        where.skillTags = {
          hasSome: filters.skillTags
        };
      }

      const employees = await prisma.employee.findMany({
        where,
        include: {
          previousExperiences: {
            orderBy: { endDate: 'desc' }
          }
        },
        orderBy: { name: 'asc' }
      });

      return employees;
    } catch (error) {
      console.error('Error fetching employees:', error);
      throw new Error('Failed to fetch employees');
    }
  }

  // Get employee by ID
  async getEmployeeById(id: number): Promise<Employee | null> {
    try {
      const employee = await prisma.employee.findUnique({
        where: { id },
        include: {
          previousExperiences: {
            orderBy: { endDate: 'desc' }
          }
        }
      });

      return employee;
    } catch (error) {
      console.error('Error fetching employee:', error);
      throw new Error('Failed to fetch employee');
    }
  }

  // Search employees by query string
  async searchEmployees(
    query: string, 
    filters?: EmployeeSearchFilters,
    page: number = 1,
    limit: number = 20
  ): Promise<EmployeeSearchResult> {
    try {
      const where: any = {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { currentRole: { contains: query, mode: 'insensitive' } },
          { currentProject: { contains: query, mode: 'insensitive' } },
          { about: { contains: query, mode: 'insensitive' } },
          { skillTags: { hasSome: [query] } }
        ]
      };

      // Apply additional filters
      if (filters?.location) {
        where.location = filters.location;
      }
      
      if (filters?.skillTags && filters.skillTags.length > 0) {
        where.skillTags = {
          hasSome: filters.skillTags
        };
      }

      const [employees, total] = await Promise.all([
        prisma.employee.findMany({
          where,
          include: {
            previousExperiences: {
              orderBy: { endDate: 'desc' },
              take: 3 // Limit previous experiences for search results
            }
          },
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { name: 'asc' }
        }),
        prisma.employee.count({ where })
      ]);

      return {
        employees,
        total,
        page,
        limit
      };
    } catch (error) {
      console.error('Error searching employees:', error);
      throw new Error('Failed to search employees');
    }
  }

  // Create new employee
  async createEmployee(data: CreateEmployeeInput): Promise<Employee> {
    try {
      const employee = await prisma.employee.create({
        data,
        include: {
          previousExperiences: true
        }
      });

      return employee;
    } catch (error) {
      console.error('Error creating employee:', error);
      throw new Error('Failed to create employee');
    }
  }

  // Update employee
  async updateEmployee(id: number, data: UpdateEmployeeInput): Promise<Employee> {
    try {
      const employee = await prisma.employee.update({
        where: { id },
        data,
        include: {
          previousExperiences: {
            orderBy: { endDate: 'desc' }
          }
        }
      });

      return employee;
    } catch (error) {
      console.error('Error updating employee:', error);
      throw new Error('Failed to update employee');
    }
  }

  // Delete employee
  async deleteEmployee(id: number): Promise<void> {
    try {
      await prisma.employee.delete({
        where: { id }
      });
    } catch (error) {
      console.error('Error deleting employee:', error);
      throw new Error('Failed to delete employee');
    }
  }

  // Previous Experience methods
  async addPreviousExperience(data: CreatePreviousExperienceInput): Promise<PreviousExperience> {
    try {
      const experience = await prisma.previousExperience.create({
        data,
        include: {
          employee: true
        }
      });

      return experience;
    } catch (error) {
      console.error('Error adding previous experience:', error);
      throw new Error('Failed to add previous experience');
    }
  }

  async updatePreviousExperience(
    id: number, 
    data: UpdatePreviousExperienceInput
  ): Promise<PreviousExperience> {
    try {
      const experience = await prisma.previousExperience.update({
        where: { id },
        data,
        include: {
          employee: true
        }
      });

      return experience;
    } catch (error) {
      console.error('Error updating previous experience:', error);
      throw new Error('Failed to update previous experience');
    }
  }

  async deletePreviousExperience(id: number): Promise<void> {
    try {
      await prisma.previousExperience.delete({
        where: { id }
      });
    } catch (error) {
      console.error('Error deleting previous experience:', error);
      throw new Error('Failed to delete previous experience');
    }
  }

  // Utility methods
  async getAllSkillTags(): Promise<string[]> {
    try {
      const employees = await prisma.employee.findMany({
        select: { skillTags: true }
      });

      const allTags = employees.flatMap(emp => emp.skillTags) as string[];
      const uniqueTags = [...new Set(allTags)].sort();
      
      return uniqueTags;
    } catch (error) {
      console.error('Error fetching skill tags:', error);
      throw new Error('Failed to fetch skill tags');
    }
  }

  async getEmployeeCount(): Promise<number> {
    try {
      return await prisma.employee.count();
    } catch (error) {
      console.error('Error getting employee count:', error);
      throw new Error('Failed to get employee count');
    }
  }
}

// Export singleton instance
export const employeeService = new EmployeeService();