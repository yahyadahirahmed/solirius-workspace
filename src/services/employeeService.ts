import type { 
  Employee, 
  PreviousExperience, 
  CreateEmployeeInput, 
  UpdateEmployeeInput,
  CreatePreviousExperienceInput,
  UpdatePreviousExperienceInput,
  EmployeeSearchResult,
  Location
} from '@/types/employee';

const API_BASE_URL = 'http://localhost:3001/api';

export class EmployeeService {
  // Get all employees with optional filters
  async getAllEmployees(): Promise<Employee[]> {
    try {
      const params = new URLSearchParams();

      
      const url = `${API_BASE_URL}/employees${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching employees:', error);
      throw new Error('Failed to fetch employees');
    }
  }

  // Get employee by ID
  async getEmployeeById(id: number): Promise<Employee | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/employees/${id}`);
      
      if (response.status === 404) {
        return null;
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching employee:', error);
      throw new Error('Failed to fetch employee');
    }
  }

  // Search employees
  async searchEmployees(query: string): Promise<EmployeeSearchResult> {
    try {
      const params = new URLSearchParams();
      params.append('q', query);
      
      const response = await fetch(`${API_BASE_URL}/employees/search?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error searching employees:', error);
      throw new Error('Failed to search employees');
    }
  
    
  }

  // Create new employee
  async createEmployee(employeeData: CreateEmployeeInput): Promise<Employee> {
    try {
      const response = await fetch(`${API_BASE_URL}/employees`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employeeData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating employee:', error);
      throw new Error('Failed to create employee');
    }
  }

  // Update employee
  async updateEmployee(id: number, employeeData: UpdateEmployeeInput): Promise<Employee> {
    try {
      const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employeeData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating employee:', error);
      throw new Error('Failed to update employee');
    }
  }

  // Delete employee
  async deleteEmployee(id: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting employee:', error);
      throw new Error('Failed to delete employee');
    }
  }

  // Get all unique skill tags
  async getAllSkillTags(): Promise<string[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/skill-tags`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching skill tags:', error);
      throw new Error('Failed to fetch skill tags');
    }
  }

}

// Create and export a singleton instance
export const employeeService = new EmployeeService();