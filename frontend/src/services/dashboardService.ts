import { apiClient } from '@/lib/api';
import { handleApiCall } from '@/lib/errorHandler';

export interface GlobalDashboardStats {
  usuarios: { total: number; admins: number; recolectores: number; usuarios: number };
  residuos: { total: number; activos: number; inactivos: number; categorias: number };
  recolecciones: { total: number; hoy: number; pendientes: number; en_proceso: number; completadas: number };
  solicitudes: { total: number; pendientes: number; aprobadas: number; rechazadas: number };
  timestamp: string;
}

export interface PersonalStats {
  solicitudes: { total: number; pendientes: number };
  recolecciones: { total: number };
  timestamp: string;
}

export class DashboardService {
  static async getGlobalStats(): Promise<GlobalDashboardStats> {
    return handleApiCall(async () => {
      const res = await apiClient.get<GlobalDashboardStats>('/dashboard/estadisticas');
      return res.data;
    });
  }

  static async getPersonalStats(): Promise<PersonalStats> {
    return handleApiCall(async () => {
      const res = await apiClient.get<PersonalStats>('/dashboard/estadisticas-personales');
      return res.data;
    });
  }
}
