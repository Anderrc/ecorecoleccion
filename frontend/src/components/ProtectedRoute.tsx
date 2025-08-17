'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  requiredRole?: number;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectTo = '/login',
  requiredRole,
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        // No autenticado - redirigir al login
        router.push(redirectTo);
        return;
      }

      if (requiredRole && user && user.rol !== requiredRole) {
        // No tiene el rol requerido - redirigir al dashboard
        router.push('/dashboard');
        return;
      }
    }
  }, [isAuthenticated, isLoading, user, router, redirectTo, requiredRole]);

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-eco-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  // No mostrar nada si no está autenticado (se está redirigiendo)
  if (!isAuthenticated) {
    return null;
  }

  // Verificar rol si es requerido
  if (requiredRole && user && user.rol !== requiredRole) {
    return null;
  }

  // Mostrar el contenido protegido
  return <>{children}</>;
};
