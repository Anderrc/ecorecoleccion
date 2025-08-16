import { apiClient } from '@/lib/api';

// Interfaces para solicitudes
export interface Solicitud {
  id: number;
  usuario_id: number;
  descripcion: string;
  fecha: string;
  estado?: 'pendiente' | 'aprobada' | 'rechazada';
}

export interface CreateSolicitudRequest {
  usuario_id: number;
  descripcion: string;
}

export interface SolicitudResponse {
  message: string;
  id: number;
}

/**
 * Servicio para operaciones de solicitudes
 */
export class SolicitudService {
  private static readonly BASE_PATH = '/solicitudes';

  /**
   * Crear una nueva solicitud
   */
  static async crear(solicitudData: CreateSolicitudRequest): Promise<SolicitudResponse> {
    try {
      const response = await apiClient.post<SolicitudResponse>(
        this.BASE_PATH,
        solicitudData
      );
      return response.data;
    } catch (error) {
      throw new Error('Error al crear la solicitud');
    }
  }

  /**
   * Obtener todas las solicitudes
   */
  static async getAll(): Promise<Solicitud[]> {
    try {
      const response = await apiClient.get<Solicitud[]>(this.BASE_PATH);
      return response.data;
    } catch (error) {
      throw new Error('Error al obtener solicitudes');
    }
  }

  /**
   * Obtener solicitudes por usuario
   */
  static async getByUsuario(usuarioId: number): Promise<Solicitud[]> {
    try {
      const response = await apiClient.get<Solicitud[]>(`${this.BASE_PATH}/usuario/${usuarioId}`);
      return response.data;
    } catch (error) {
      throw new Error('Error al obtener solicitudes del usuario');
    }
  }

  /**
   * Obtener solicitud por ID
   */
  static async getById(id: number): Promise<Solicitud> {
    try {
      const response = await apiClient.get<Solicitud>(`${this.BASE_PATH}/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('Solicitud no encontrada');
    }
  }

  /**
   * Actualizar solicitud
   */
  static async update(id: number, solicitudData: Partial<CreateSolicitudRequest>): Promise<Solicitud> {
    try {
      const response = await apiClient.put<Solicitud>(
        `${this.BASE_PATH}/${id}`,
        solicitudData
      );
      return response.data;
    } catch (error) {
      throw new Error('Error al actualizar solicitud');
    }
  }

  /**
   * Cambiar estado de solicitud
   */
  static async cambiarEstado(id: number, estado: 'pendiente' | 'aprobada' | 'rechazada'): Promise<Solicitud> {
    try {
      const response = await apiClient.patch<Solicitud>(
        `${this.BASE_PATH}/${id}/estado`,
        { estado }
      );
      return response.data;
    } catch (error) {
      throw new Error('Error al cambiar estado de solicitud');
    }
  }

  /**
   * Eliminar solicitud
   */
  static async delete(id: number): Promise<void> {
    try {
      await apiClient.delete(`${this.BASE_PATH}/${id}`);
    } catch (error) {
      throw new Error('Error al eliminar solicitud');
    }
  }

  /**
   * Obtener solicitudes pendientes
   */
  static async getPendientes(): Promise<Solicitud[]> {
    try {
      const response = await apiClient.get<Solicitud[]>(`${this.BASE_PATH}/pendientes`);
      return response.data;
    } catch (error) {
      throw new Error('Error al obtener solicitudes pendientes');
    }
  }

  /**
   * Aprobar solicitud
   */
  static async aprobar(id: number): Promise<Solicitud> {
    return this.cambiarEstado(id, 'aprobada');
  }

  /**
   * Rechazar solicitud
   */
  static async rechazar(id: number): Promise<Solicitud> {
    return this.cambiarEstado(id, 'rechazada');
  }
}
