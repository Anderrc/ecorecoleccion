'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthService } from '@/services';
import { User } from '@/types/roles';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (correo: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  // Asegurar que el componente está montado antes de acceder a localStorage
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Verificar si hay un usuario guardado al cargar la aplicación
  useEffect(() => {
    if (!isMounted) return;
    
    const checkAuth = () => {
      try {
        const savedUser = localStorage.getItem('user');
        const token = localStorage.getItem('authToken');
        
        if (savedUser && token) {
          // Verificar si el token no ha expirado
          if (!AuthService.isTokenExpired(token)) {
            setUser(JSON.parse(savedUser));
          } else {
            // Token expirado, limpiar datos
            console.log('Token expirado al cargar, limpiando sesión...');
            AuthService.clearExpiredSession();
          }
        }
      } catch (error) {
        console.error('Error al verificar autenticación:', error);
        // Limpiar datos corruptos
        AuthService.clearExpiredSession();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [isMounted]);

  const login = async (correo: string, password: string) => {
    try {
      const response = await AuthService.login({ correo, password });
      
      // Guardar usuario y token solo si el componente está montado
      if (isMounted) {
        localStorage.setItem('user', JSON.stringify(response.user));
        localStorage.setItem('authToken', response.token);
      }
      
      setUser(response.user);
    } catch (error) {
      throw error; // Re-lanzar el error para que lo maneje el componente
    }
  };

  const logout = async () => {
    try {
      await AuthService.logout();
    } catch (error) {
      console.error('Error al hacer logout:', error);
      // Continuar con el logout local incluso si falla el del servidor
    } finally {
      // Limpiar estado local usando el método del servicio
      AuthService.clearExpiredSession();
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading: isLoading || !isMounted, // Considerar loading si no está montado
    login,
    logout,
    setUser,
  };

  // No renderizar children hasta que el componente esté montado
  if (!isMounted) {
    return (
      <AuthContext.Provider value={{
        user: null,
        isAuthenticated: false,
        isLoading: true,
        login: async () => {},
        logout: async () => {},
        setUser: () => {},
      }}>
        {children}
      </AuthContext.Provider>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
