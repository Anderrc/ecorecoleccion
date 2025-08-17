'use client';

import React from 'react';
import { useSessionValidation } from '@/hooks/useSessionValidation';

interface RootLayoutClientProps {
  children: React.ReactNode;
}

/**
 * Componente cliente para el layout raíz que incluye validación de sesión
 */
export const RootLayoutClient: React.FC<RootLayoutClientProps> = ({ children }) => {
  // Validar sesión en toda la aplicación
  useSessionValidation();

  return <>{children}</>;
};

export default RootLayoutClient;
