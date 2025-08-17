import { apiClient } from '@/lib/api';
import { handleApiCall } from '@/lib/errorHandler';

export interface UsuarioListado {
  id: number;
  user_name: string;
  correo: string;
  nombre: string;
  apellidos: string;
  rol_id: number;
  created_at?: string;
  updated_at?: string;
}

export interface Paginacion {
  page: number;
  pageSize: number;
  total: number;
}

export interface ListarUsuariosResponse {
  data: UsuarioListado[];
  pagination: Paginacion;
}

export interface CrearUsuarioPayload {
  user_name: string;
  correo: string;
  password: string;
  nombre: string;
  apellidos: string;
  rol_id?: number;
}

export interface ActualizarUsuarioPayload {
  user_name?: string;
  correo?: string;
  password?: string;
  nombre?: string;
  apellidos?: string;
  rol_id?: number;
}

export class GestionUsuarioService {
  private static readonly BASE = '/usuarios';

  static async listar(params: { buscar?: string; rol_id?: number; page?: number; pageSize?: number } = {}): Promise<ListarUsuariosResponse> {
    return handleApiCall(async () => {
      const res = await apiClient.get<ListarUsuariosResponse>(this.BASE, { params });
      return res.data;
    });
  }

  static async obtener(id: number): Promise<UsuarioListado> {
    return handleApiCall(async () => {
      const res = await apiClient.get<UsuarioListado>(`${this.BASE}/${id}`);
      return res.data;
    });
  }

  static async crear(payload: CrearUsuarioPayload): Promise<UsuarioListado> {
    return handleApiCall(async () => {
      const res = await apiClient.post<UsuarioListado>(this.BASE, payload);
      return res.data;
    });
  }

  static async actualizar(id: number, payload: ActualizarUsuarioPayload): Promise<UsuarioListado> {
    return handleApiCall(async () => {
      const res = await apiClient.put<UsuarioListado>(`${this.BASE}/${id}`, payload);
      return res.data;
    });
  }

  static async eliminar(id: number): Promise<void> {
    return handleApiCall(async () => {
      await apiClient.delete(`${this.BASE}/${id}`);
    });
  }

  static async cambiarRol(id: number, rol_id: number): Promise<{ message: string }> {
    return handleApiCall(async () => {
      const res = await apiClient.patch<{ message: string }>(`${this.BASE}/${id}/rol`, { rol_id });
      return res.data;
    });
  }
}
