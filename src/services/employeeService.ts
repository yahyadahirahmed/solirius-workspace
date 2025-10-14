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

const API_BASE_URL = import.meta.env.PROD 
  ? 'https://solirius-workspace.onrender.com/api' 
  : 'http://localhost:3001/api';


// random string generator
function generateRandomString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export class EmployeeService {
  // Get all employees with optional filters
  async getAllEmployees(): Promise<Employee[]> {
    try {


      const response = await fetch(`${API_BASE_URL}/employees`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.employees;
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

  async getEmployeeDBId(userId: string): Promise<number | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/employees/by-supabase-id/${userId}`);

      if (response.status === 404) {
        return null;
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const employeeId = await response.json();
      return employeeId; // Server now returns just the ID number, not an object
    } 
    catch (error) {
      console.error('Error fetching employee by user ID:', error);
      throw new Error('Failed to fetch employee by user ID');
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
       body: JSON.stringify({
        ...employeeData,
        password: generateRandomString(6)
      }),
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