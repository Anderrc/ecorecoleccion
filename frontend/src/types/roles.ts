export enum UserRole {
  ADMIN = 1,
  USUARIO = 3,
  RECOLECTOR = 2,
}

export interface User {
  id: number;
  nombre: string;
  apellidos: string;
  correo: string;
  user_name?: string;
  rol: UserRole;
}

export interface Permission {
  action: string;
  resource: string;
}

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.ADMIN]: [
    // Acceso total y absoluto al sistema - ADMIN tiene todos los permisos
    { action: 'read', resource: 'users' },
    { action: 'write', resource: 'users' },
    { action: 'delete', resource: 'users' },
    { action: 'create', resource: 'users' },
    { action: 'read', resource: 'collections' },
    { action: 'write', resource: 'collections' },
    { action: 'delete', resource: 'collections' },
    { action: 'create', resource: 'collections' },
    { action: 'read', resource: 'reports' },
    { action: 'write', resource: 'reports' },
    { action: 'delete', resource: 'reports' },
    { action: 'create', resource: 'reports' },
    { action: 'read', resource: 'waste-types' },
    { action: 'write', resource: 'waste-types' },
    { action: 'delete', resource: 'waste-types' },
    { action: 'create', resource: 'waste-types' },
    { action: 'read', resource: 'points' },
    { action: 'write', resource: 'points' },
    { action: 'delete', resource: 'points' },
    { action: 'create', resource: 'points' },
    { action: 'read', resource: 'discount-codes' },
    { action: 'write', resource: 'discount-codes' },
    { action: 'delete', resource: 'discount-codes' },
    { action: 'create', resource: 'discount-codes' },
    { action: 'read', resource: 'collection-routes' },
    { action: 'write', resource: 'collection-routes' },
    { action: 'delete', resource: 'collection-routes' },
    { action: 'create', resource: 'collection-routes' },
    { action: 'read', resource: 'collection-requests' },
    { action: 'write', resource: 'collection-requests' },
    { action: 'delete', resource: 'collection-requests' },
    { action: 'create', resource: 'collection-requests' },
    { action: 'read', resource: 'dashboard' },
    { action: 'write', resource: 'dashboard' },
    { action: 'read', resource: 'settings' },
    { action: 'write', resource: 'settings' },
    { action: 'read', resource: 'analytics' },
    { action: 'write', resource: 'analytics' },
    { action: 'read', resource: 'roles' },
    { action: 'write', resource: 'roles' },
    { action: 'delete', resource: 'roles' },
    { action: 'create', resource: 'roles' },
    // Permisos especiales de administrador
    { action: 'admin', resource: 'system' },
    { action: 'manage', resource: 'all' },
    { action: 'override', resource: 'permissions' },
  ],
  [UserRole.USUARIO]: [
    // Acceso de usuario regular
    { action: 'read', resource: 'reports' },
    { action: 'write', resource: 'collection-requests' },
    { action: 'read', resource: 'collection-requests' },
    { action: 'read', resource: 'discount-codes' },
    { action: 'write', resource: 'discount-codes' },
    { action: 'read', resource: 'points' },
  ],
  [UserRole.RECOLECTOR]: [
    // Acceso de recolector
    { action: 'read', resource: 'collection-routes' },
    { action: 'write', resource: 'collections' },
    { action: 'read', resource: 'collections' },
    { action: 'read', resource: 'users' }, // Solo para validar usuarios durante recolección
    { action: 'read', resource: 'waste-types' },
    { action: 'write', resource: 'points' },
  ],
};

export const ROLE_NAMES: Record<UserRole, string> = {
  [UserRole.ADMIN]: 'Administrador',
  [UserRole.USUARIO]: 'Usuario',
  [UserRole.RECOLECTOR]: 'Recolector',
};
