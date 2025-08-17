// Exportar todos los servicios desde un solo lugar
export * from './usuarioService';
export * from './rolService';
export * from './solicitudService';
export * from './dashboardService';
export * from './reporteService';
export * from './residuoService';
export * from './gestionUsuarioService';
export * from './recoleccionService';

// Re-exportar el cliente API
export { apiClient } from '@/lib/api';
