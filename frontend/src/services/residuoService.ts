import { apiClient } from '@/lib/api';
import { handleApiCall } from '@/lib/errorHandler';

export interface Residuo {
  id: number;
  nombre: string;
  descripcion?: string;
  puntaje_base: number;
  categoria?: string;
  estado: string;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
}

export interface CreateResiduoRequest {
  nombre: string;
  descripcion?: string;
  puntaje_base: number;
  categoria: string;
  estado?: 'activo' | 'inactivo';
}

export interface UpdateResiduoRequest {
  nombre?: string;
  descripcion?: string;
  puntaje_base?: number;
  categoria?: string;
  estado?: 'activo' | 'inactivo';
}

export class ResiduoService {
  private static readonly BASE_PATH = '/residuos';

  /**
   * Obtener todos los tipos de residuos
   */
  static async listar(params?: { categoria?: string; estado?: string; buscar?: string }): Promise<Residuo[]> {
    return handleApiCall(async () => {
      const query = new URLSearchParams();
      if (params?.categoria) query.append('categoria', params.categoria);
      if (params?.estado) query.append('estado', params.estado);
      if (params?.buscar) query.append('buscar', params.buscar);
      const res = await apiClient.get<Residuo[]>(`${this.BASE_PATH}${query.toString() ? `?${query.toString()}` : ''}`);
      return res.data;
    });
  }

  /**
   * Obtener un tipo de residuo por ID
   */
  static async obtenerPorId(id: number): Promise<Residuo> {
    return handleApiCall(async () => {
      const res = await apiClient.get<Residuo>(`${this.BASE_PATH}/${id}`);
      return res.data;
    });
  }

  /**
   * Crear un nuevo tipo de residuo
   */
  static async crear(data: CreateResiduoRequest): Promise<{ message: string; id: number }> {
    return handleApiCall(async () => {
      const res = await apiClient.post<{ message: string; id: number }>(`${this.BASE_PATH}`, data);
      return res.data;
    });
  }

  /**
   * Actualizar un tipo de residuo
   */
  static async actualizar(id: number, data: UpdateResiduoRequest): Promise<{ message: string }> {
    return handleApiCall(async () => {
      const res = await apiClient.put<{ message: string }>(`${this.BASE_PATH}/${id}`, data);
      return res.data;
    });
  }

  /**
   * Eliminar un tipo de residuo
   */
  static async eliminar(id: number): Promise<{ message: string }> {
    return handleApiCall(async () => {
      const res = await apiClient.delete<{ message: string }>(`${this.BASE_PATH}/${id}`);
      return res.data;
    });
  }

  /**
   * Obtener categorías únicas
   */
  static async obtenerCategorias(): Promise<string[]> {
    return handleApiCall(async () => {
      const res = await apiClient.get<string[]>(`${this.BASE_PATH}/categorias`);
      return res.data;
    });
  }

  /**
   * Obtener estadísticas de tipos de residuos
   */
  static async obtenerEstadisticas(): Promise<{
    total_tipos_residuos: number;
    categorias_unicas: number;
    promedio_puntaje: number;
    max_puntaje: number;
    min_puntaje: number;
    activos: number;
    inactivos: number;
  }> {
    return handleApiCall(async () => {
      const res = await apiClient.get<{
        total_tipos_residuos: number;
        categorias_unicas: number;
        promedio_puntaje: number;
        max_puntaje: number;
        min_puntaje: number;
        activos: number;
        inactivos: number;
      }>(`${this.BASE_PATH}/estadisticas`);
      return res.data;
    });
  }
}
