import { useState, useEffect, useCallback } from 'react';
import { employeeService } from '@/services/employeeService';
import type { 
  Employee, 
  EmployeeSearchFilters, 
  EmployeeSearchResult 
} from '@/types/employee';

// Hook for getting all employees
export function useEmployees(filters?: EmployeeSearchFilters) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await employeeService.getAllEmployees(filters);
      setEmployees(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load employees');
      console.error('Error loading employees:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, [JSON.stringify(filters)]); // Re-run when filters change

  const refreshEmployees = () => {
    loadEmployees();
  };

  return {
    employees,
    loading,
    error,
    refreshEmployees
  };
}

// Hook for getting a single employee
export function useEmployee(id: number) {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEmployee = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        const data = await employeeService.getEmployeeById(id);
        setEmployee(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load employee');
        console.error('Error loading employee:', err);
      } finally {
        setLoading(false);
      }
    };

    loadEmployee();
  }, [id]);

  return {
    employee,
    loading,
    error
  };
}

// Hook for searching employees
export function useEmployeeSearch() {
  const [results, setResults] = useState<EmployeeSearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (query: string) => {
    if (!query.trim()) {
      setResults(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log('useEmployeeSearch: Searching for:', query); // Debug log
      const searchResult = await employeeService.searchEmployees(query);
      console.log('useEmployeeSearch: Results:', searchResult); // Debug log
      setResults(searchResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
      console.error('Error searching employees:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults(null);
    setError(null);
  }, []);

  return {
    results,
    loading,
    error,
    search,
    clearResults
  };
}

// Hook for getting all skill tags
export function useSkillTags() {
  const [skillTags, setSkillTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSkillTags = async () => {
      try {
        setLoading(true);
        setError(null);
        const tags = await employeeService.getAllSkillTags();
        setSkillTags(tags);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load skill tags');
        console.error('Error loading skill tags:', err);
      } finally {
        setLoading(false);
      }
    };

    loadSkillTags();
  }, []);

  return {
    skillTags,
    loading,
    error
  };
}