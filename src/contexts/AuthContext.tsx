
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '@/hooks/useApi';
import { setCookie, getCookie, deleteCookie } from '@/utils/cookie';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};


export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user and token are stored in localStorage
    const savedUser = localStorage.getItem('user');
    const savedToken = getCookie('token');
    if (savedUser && savedToken) {
      try {
        setUser(JSON.parse(savedUser));
        api.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
      } catch (e) {
        localStorage.removeItem('user');
        deleteCookie('token');
        setUser(null);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
  setIsLoading(true);
  try {
    // Llamada a la API para autenticación
    const response = await api.post('/login', { email, password });
    const { access_token, usuario } = response.data;
    setUser(usuario);
    localStorage.setItem('user', JSON.stringify(usuario));
    setCookie('token', access_token, 7); // 7 días por defecto
    api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error('Error de autenticación. Intenta nuevamente.');
    }
  } finally {
    setIsLoading(false);
  }
};

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    deleteCookie('token');
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
