'use client';

import { useAuth } from '@/contexts/AuthContext';
import { UserRole, ROLE_PERMISSIONS, Permission } from '@/types/roles';

export const usePermissions = () => {
  const { user } = useAuth();

  const hasPermission = (action: string, resource: string): boolean => {
    if (!user) return false;

    // ADMIN tiene acceso absoluto a todo - bypass de verificaciones
    if (user.rol === UserRole.ADMIN) {
      return true;
    }

    const userPermissions = ROLE_PERMISSIONS[user.rol as UserRole] || [];
    return userPermissions.some(
      (permission: Permission) => 
        permission.action === action && permission.resource === resource
    );
  };

  const hasAnyPermission = (permissions: { action: string; resource: string }[]): boolean => {
    // ADMIN tiene acceso absoluto
    if (user?.rol === UserRole.ADMIN) {
      return true;
    }
    
    return permissions.some(({ action, resource }) => hasPermission(action, resource));
  };

  const hasAllPermissions = (permissions: { action: string; resource: string }[]): boolean => {
    // ADMIN tiene acceso absoluto
    if (user?.rol === UserRole.ADMIN) {
      return true;
    }
    
    return permissions.every(({ action, resource }) => hasPermission(action, resource));
  };

  const isAdmin = (): boolean => {
    return user?.rol === UserRole.ADMIN;
  };

  const isUsuario = (): boolean => {
    return user?.rol === UserRole.USUARIO;
  };

  const isRecolector = (): boolean => {
    return user?.rol === UserRole.RECOLECTOR;
  };

  const getUserRole = (): UserRole | null => {
    return user?.rol as UserRole || null;
  };

  const canAccessEverything = (): boolean => {
    return user?.rol === UserRole.ADMIN;
  };

  const canManage = (resource: string): boolean => {
    // ADMIN puede gestionar cualquier recurso
    if (user?.rol === UserRole.ADMIN) {
      return true;
    }
    
    return hasPermission('write', resource) || hasPermission('create', resource) || hasPermission('delete', resource);
  };

  const canCreate = (resource: string): boolean => {
    return hasPermission('create', resource);
  };

  const canRead = (resource: string): boolean => {
    return hasPermission('read', resource);
  };

  const canUpdate = (resource: string): boolean => {
    return hasPermission('write', resource);
  };

  const canDelete = (resource: string): boolean => {
    return hasPermission('delete', resource);
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isAdmin,
    isUsuario,
    isRecolector,
    getUserRole,
    canAccessEverything,
    canManage,
    canCreate,
    canRead,
    canUpdate,
    canDelete,
    userPermissions: user ? ROLE_PERMISSIONS[user.rol as UserRole] : [],
  };
};
