'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Hook para proteger rutas que requieren autenticación
 * @param redirectTo - Ruta a la que redirigir si no está autenticado
 * @param requiredRole - Rol requerido para acceder a la ruta
 */
export const useRequireAuth = (redirectTo: string = '/login', requiredRole?: number) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push(redirectTo);
        return;
      }

      if (requiredRole && user && user.rol !== requiredRole) {
        router.push('/dashboard'); // Redirigir a dashboard si no tiene el rol correcto
        return;
      }
    }
  }, [isAuthenticated, isLoading, user, router, redirectTo, requiredRole]);

  return { user, isAuthenticated, isLoading };
};

/**
 * Hook para redirigir usuarios autenticados (útil para login/registro)
 * @param redirectTo - Ruta a la que redirigir si está autenticado
 */
export const useRedirectIfAuthenticated = (redirectTo: string = '/dashboard') => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, isLoading, router, redirectTo]);

  return { isAuthenticated, isLoading };
};
