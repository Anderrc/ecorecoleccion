import { apiClient } from '@/lib/api';
import { handleApiCall } from '@/lib/errorHandler';

export interface RecoleccionReporte {
  id: number;
  fecha: string;
  direccion: string;
  tipoResiduo: string;
  cantidadKg: number | null;
  puntosObtenidos: number;
  estado: string;
  recolector: string;
  observaciones: string | null;
  categoria?: string;
}

export interface EstadisticasUsuarioReporte {
  totalRecolecciones: number;
  completadas: number;
  pendientes: number;
  enProceso: number;
  totalPuntos: number;
  categorias: number;
  totalKg: number | null;
}

export class ReporteService {
  static async obtenerMisRecolecciones(params?: { period?: string; tipo?: string }): Promise<RecoleccionReporte[]> {
    return handleApiCall(async () => {
      const query = new URLSearchParams();
      if (params?.period) query.append('period', params.period);
      if (params?.tipo) query.append('tipo', params.tipo);
      const res = await apiClient.get<RecoleccionReporte[]>(`/reportes/mios${query.toString() ? `?${query.toString()}` : ''}`);
      return res.data;
    });
  }

  static async obtenerEstadisticas(params?: { period?: string }): Promise<EstadisticasUsuarioReporte> {
    return handleApiCall(async () => {
      const query = new URLSearchParams();
      if (params?.period) query.append('period', params.period);
      const res = await apiClient.get<EstadisticasUsuarioReporte>(`/reportes/mios/estadisticas${query.toString() ? `?${query.toString()}` : ''}`);
      return res.data;
    });
  }
}
