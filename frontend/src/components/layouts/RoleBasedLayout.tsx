'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/hooks/usePermissions';
import { UserRole, ROLE_NAMES } from '@/types/roles';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  requiredRole?: UserRole[];
  requiredPermission?: { action: string; resource: string };
}

const navigationItems: NavigationItem[] = [
  // Navegación común
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
      </svg>
    ),
  },
  
  // Navegación para Usuarios
  {
    name: 'Reportes',
    href: '/dashboard/reportes',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    requiredRole: [UserRole.USUARIO, UserRole.ADMIN],
    requiredPermission: { action: 'read', resource: 'reports' },
  },
  {
    name: 'Solicitar Recolección',
    href: '/dashboard/solicitar-recoleccion',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    ),
    requiredRole: [UserRole.USUARIO, UserRole.ADMIN],
    requiredPermission: { action: 'write', resource: 'collection-requests' },
  },
  {
    name: 'Códigos de Descuento',
    href: '/dashboard/codigos-descuento',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
      </svg>
    ),
    requiredRole: [UserRole.USUARIO, UserRole.ADMIN],
    requiredPermission: { action: 'read', resource: 'discount-codes' },
  },
  
  // Navegación para Recolectores
  {
    name: 'Rutas de Recolección',
    href: '/dashboard/rutas',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    requiredRole: [UserRole.RECOLECTOR, UserRole.ADMIN],
    requiredPermission: { action: 'read', resource: 'collection-routes' },
  },
  {
    name: 'Registrar Recolección',
    href: '/dashboard/registrar-recoleccion',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    requiredRole: [UserRole.RECOLECTOR, UserRole.ADMIN],
    requiredPermission: { action: 'write', resource: 'collections' },
  },
  
  // Navegación para Administradores
  {
    name: 'Gestión de Usuarios',
    href: '/dashboard/usuarios',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
      </svg>
    ),
    requiredRole: [UserRole.ADMIN],
    requiredPermission: { action: 'read', resource: 'users' },
  },
  {
  name: 'Recolecciones',
    href: '/dashboard/recolecciones',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
  requiredRole: [UserRole.ADMIN, UserRole.RECOLECTOR],
    requiredPermission: { action: 'read', resource: 'collections' },
  },
  {
    name: 'Tipos de Residuos',
    href: '/dashboard/tipos-residuos',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    ),
    requiredRole: [UserRole.ADMIN],
    requiredPermission: { action: 'read', resource: 'waste-types' },
  },
];

interface RoleBasedLayoutProps {
  children: React.ReactNode;
}

export const RoleBasedLayout: React.FC<RoleBasedLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const { hasPermission, getUserRole } = usePermissions();
  const pathname = usePathname();
  const userRole = getUserRole();

  const filteredNavigation = navigationItems.filter(item => {
    // Admin tiene acceso a todo
    if (userRole === UserRole.ADMIN) {
      return true;
    }

    // Si no tiene restricción de rol, mostrar siempre
    if (!item.requiredRole && !item.requiredPermission) {
      return true;
    }

    // Verificar rol
    if (item.requiredRole && userRole && !item.requiredRole.includes(userRole)) {
      return false;
    }

    // Verificar permisos
    if (item.requiredPermission) {
      return hasPermission(item.requiredPermission.action, item.requiredPermission.resource);
    }

    return true;
  });

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/login';
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
        <div className="flex flex-col h-full">
          {/* Header del sidebar */}
          <div className="flex items-center justify-center h-16 bg-green-600 text-white">
            <h1 className="text-xl font-bold">EcoRecolección</h1>
          </div>

          {/* Información del usuario */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold">
                {user?.nombre?.charAt(0)}{user?.apellidos?.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.nombre} {user?.apellidos}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {userRole ? ROLE_NAMES[userRole] : 'Usuario'}
                </p>
              </div>
            </div>
          </div>

          {/* Navegación */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {filteredNavigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
                    ${isActive
                      ? 'bg-green-100 text-green-900 border-r-2 border-green-500'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <span className={`mr-3 ${isActive ? 'text-green-500' : 'text-gray-400 group-hover:text-gray-500'}`}>
                    {item.icon}
                  </span>
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Footer del sidebar */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-red-50 hover:text-red-700 transition-colors"
            >
              <svg className="mr-3 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="ml-64">
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};
