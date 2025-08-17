// UI Components
export { default as Button } from './ui/Button';
export { default as Input } from './ui/Input';
export { default as Card } from './ui/Card';
export { default as Textarea } from './ui/Textarea';
export { default as Select } from './ui/Select';
export { Modal } from './ui/Modal';

// Layout Components
export { default as Sidebar } from './Sidebar';
export { default as Header } from './Header';
export { default as DashboardLayout } from './DashboardLayout';
export { RoleBasedLayout } from './layouts/RoleBasedLayout';
export { UserMenu } from './UserMenu';
export { ProtectedRoute } from './ProtectedRoute';
export { ClientProviders } from './ClientProviders';

// Guard Components
export { RoleGuard, PermissionGuard, AdminGuard, UsuarioGuard, RecolectorGuard, MultiRoleGuard } from './guards/RoleGuard';

// Feature Components
export { default as StatCard } from './StatCard';
export { default as RegistroForm } from './RegistroForm';
export { default as RegistroRecoleccionForm } from './RegistroRecoleccionForm';

// Modal Components
export { default as TipoResiduoModal } from './modals/TipoResiduoModal';
