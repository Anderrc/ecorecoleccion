import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/services';

/**
 * Hook para validar sesión activa y redirigir automáticamente
 */
export const useSessionValidation = () => {
  const router = useRouter();

  useEffect(() => {
    const validateSession = () => {
      // Solo ejecutar en el cliente
      if (typeof window === 'undefined') return;

      const currentPath = window.location.pathname;
      
      // Si estamos en login o registro, verificar si ya hay sesión válida
      if (currentPath === '/login' || currentPath === '/registro') {
        if (AuthService.hasValidSession()) {
          // Hay sesión válida, redirigir al dashboard
          console.log('Sesión válida encontrada, redirigiendo al dashboard...');
          router.push('/dashboard');
          return;
        }
      }

      // Para otras páginas, verificar token si existe
      const token = localStorage.getItem('authToken');
      if (token) {
        if (AuthService.isTokenExpired(token)) {
          // Token expirado, limpiar y redirigir a login solo si no estamos ya en login/registro
          console.log('Token expirado, limpiando sesión...');
          AuthService.clearExpiredSession();
          
          if (currentPath !== '/login' && currentPath !== '/registro') {
            router.push('/login');
          }
        }
      }
    };

    // Validar inmediatamente
    validateSession();

    // Configurar intervalo para verificar periódicamente
    const interval = setInterval(validateSession, 60000); // Cada minuto

    return () => clearInterval(interval);
  }, [router]);
};

export default useSessionValidation;
