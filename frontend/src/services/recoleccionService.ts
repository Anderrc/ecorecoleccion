import { apiClient } from '@/lib/api';
import { handleApiCall } from '@/lib/errorHandler';

export interface Recoleccion {
  id: number;
  nombre: string;
  fecha: string;
  estado: 'pendiente' | 'en_proceso' | 'completada';
  residuo: string;
  residuo_id: number;
  ruta_id?: number | null;
  ruta_nombre?: string | null;
  usuario_nombre?: string;
  usuario_apellidos?: string;
  usuario_username?: string;
}

export interface CrearRecoleccionPayload {
  nombre: string;
  fecha: string; // YYYY-MM-DD
  residuo_id: number;
  empresa_id?: number;
  ruta_id?: number;
  usuario_id: number;
}

export class RecoleccionService {
  private static BASE = '/recolecciones';

  static async crear(payload: CrearRecoleccionPayload) {
    return handleApiCall(async () => {
      const res = await apiClient.post<{ message:string; id:number }>(this.BASE, payload);
      return res.data;
    });
  }

  static async listar(params?: { estado?: string }) {
    return handleApiCall(async () => {
      const res = await apiClient.get<{ data: Recoleccion[] }>(this.BASE, { params });
      return res.data;
    });
  }

  static async obtener(id: number) {
    return handleApiCall(async () => {
      const res = await apiClient.get<Recoleccion>(`${this.BASE}/${id}`);
      return res.data;
    });
  }

  static async actualizarEstado(id: number, estado: 'pendiente'|'en_proceso'|'completada') {
    return handleApiCall(async () => {
      const res = await apiClient.patch<{ message:string }>(`${this.BASE}/${id}/estado`, { estado });
      return res.data;
    });
  }

  static async asignarRuta(id: number, ruta_id: number) {
    return handleApiCall(async () => {
      const res = await apiClient.post<{ message:string; ruta_id:number }>(`${this.BASE}/${id}/asignar-ruta`, { ruta_id });
      return res.data;
    });
  }
}
