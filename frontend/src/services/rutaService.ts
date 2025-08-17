import { apiClient } from '@/lib/api';

export interface RutaPunto {
  id: number;
  direccion: string;
  latitud: number | null;
  longitud: number | null;
  estado: string;
  orden: number | null;
  solicitud_id?: number | null;
}

export interface Ruta {
  id: number;
  nombre: string;
  fecha: string;
  estado: string;
  puntos: RutaPunto[];
}

export interface CrearRutaPayload {
  nombre: string;
  fecha: string; // ISO date
  puntos?: { direccion: string; latitud?: number; longitud?: number; orden?: number }[];
}

export class RutaService {
  private static readonly BASE_PATH = '/rutas';

  static async listar(buscar?: string) {
    const params: Record<string, string> = {};
    if (buscar) params.buscar = buscar;
    const res = await apiClient.get(this.BASE_PATH, { params });
    return res.data;
  }

  static async obtener(id: number) {
    const res = await apiClient.get(`${this.BASE_PATH}/${id}`);
    return res.data;
  }

  static async crear(payload: CrearRutaPayload) {
    const res = await apiClient.post(this.BASE_PATH, payload);
    return res.data;
  }

  static async actualizarEstadoRuta(id: number, estado: string) {
    const res = await apiClient.patch(`${this.BASE_PATH}/${id}/estado`, { estado });
    return res.data;
  }

  static async actualizarEstadoPunto(puntoId: number, estado: string) {
    const res = await apiClient.patch(`${this.BASE_PATH}/puntos/${puntoId}/estado`, { estado });
    return res.data;
  }
}
