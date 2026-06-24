import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { employeeService } from '@/services/employeeService';

interface Employee {
  id: number;
  name: string;
  email: string;
  currentRole: string;
}

interface AuthContextType {
  employee: Employee | null;
  accessToken: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

const API_BASE = 'http://localhost:3001/api';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restore = async () => {
      try {
        const refreshRes = await fetch(`${API_BASE}/auth/refresh`, {
          method: 'POST',
          credentials: 'include',
        });
        if (!refreshRes.ok) return;
        const { accessToken: token } = await refreshRes.json();
        setAccessToken(token);
        employeeService.setToken(token);

        const meRes = await fetch(`${API_BASE}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
          credentials: 'include',
        });
        if (meRes.ok) {
          const emp = await meRes.json();
          setEmployee(emp);
        }
      } finally {
        setLoading(false);
      }
    };
    restore();
    const interval = setInterval(async () => {
      const res = await fetch(`${API_BASE}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      });
      if (res.ok) {
        const { accessToken: token } = await res.json();
        setAccessToken(token);
        employeeService.setToken(token);
      }
    }, 14 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error('Invalid credentials');
    const data = await res.json();
    setAccessToken(data.accessToken);
    setEmployee(data.employee);
    employeeService.setToken(data.accessToken);
  };

  const logout = async (): Promise<void> => {
    await fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    setAccessToken(null);
    setEmployee(null);
    employeeService.setToken(null);
  };

  return (
    <AuthContext.Provider value={{
      employee,
      accessToken,
      loading,
      isAuthenticated: !!employee,
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}
