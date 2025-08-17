'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/hooks/usePermissions';
import { UserRole } from '@/types/roles';

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ 
  allowedRoles, 
  children, 
  fallback 
}) => {
  const { user } = useAuth();
  const { getUserRole, isAdmin } = usePermissions();

  const userRole = getUserRole();

  // ADMIN tiene acceso absoluto a todo - bypass completo
  if (isAdmin()) {
    return <>{children}</>;
  }

  if (!user || !userRole || !allowedRoles.includes(userRole)) {
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
            <div className="mb-4">
              <svg 
                className="mx-auto h-12 w-12 text-red-500" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" 
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Acceso Denegado
            </h2>
            <p className="text-gray-600 mb-4">
              No tienes permisos para acceder a esta sección.
            </p>
            <button
              onClick={() => window.history.back()}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Volver
            </button>
          </div>
        </div>
      )
    );
  }

  return <>{children}</>;
};

interface PermissionGuardProps {
  action: string;
  resource: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  action,
  resource,
  children,
  fallback
}) => {
  const { hasPermission, isAdmin } = usePermissions();

  // ADMIN tiene acceso absoluto - bypass completo
  if (isAdmin()) {
    return <>{children}</>;
  }

  if (!hasPermission(action, resource)) {
    return fallback || null;
  }

  return <>{children}</>;
};

// Guard específico para administradores
export const AdminGuard: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ 
  children, 
  fallback 
}) => {
  return (
    <RoleGuard allowedRoles={[UserRole.ADMIN]} fallback={fallback}>
      {children}
    </RoleGuard>
  );
};

// Guard específico para usuarios
export const UsuarioGuard: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ 
  children, 
  fallback 
}) => {
  return (
    <RoleGuard allowedRoles={[UserRole.USUARIO]} fallback={fallback}>
      {children}
    </RoleGuard>
  );
};

// Guard específico para recolectores
export const RecolectorGuard: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ 
  children, 
  fallback 
}) => {
  return (
    <RoleGuard allowedRoles={[UserRole.RECOLECTOR]} fallback={fallback}>
      {children}
    </RoleGuard>
  );
};

// Guard múltiple que permite varios roles
export const MultiRoleGuard: React.FC<{
  allowedRoles: UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ allowedRoles, children, fallback }) => {
  return (
    <RoleGuard allowedRoles={allowedRoles} fallback={fallback}>
      {children}
    </RoleGuard>
  );
};

// Guard que permite acceso a admins + roles específicos
export const AdminOrRoleGuard: React.FC<{
  allowedRoles: UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ allowedRoles, children, fallback }) => {
  const { isAdmin } = usePermissions();
  
  // ADMIN siempre tiene acceso
  if (isAdmin()) {
    return <>{children}</>;
  }
  
  return (
    <RoleGuard allowedRoles={allowedRoles} fallback={fallback}>
      {children}
    </RoleGuard>
  );
};

// Guard para funciones críticas del sistema (solo admin)
export const SystemAdminGuard: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ children, fallback }) => {
  const { isAdmin, canAccessEverything } = usePermissions();
  
  if (!isAdmin() || !canAccessEverything()) {
    return (
      fallback || (
        <div className="text-center py-8">
          <p className="text-red-600">Acceso restringido solo para administradores del sistema.</p>
        </div>
      )
    );
  }
  
  return <>{children}</>;
};
