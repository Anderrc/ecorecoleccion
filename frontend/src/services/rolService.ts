import { apiClient } from '@/lib/api';

// Interfaces para roles
export interface Rol {
  Rol_ID: number;
  Nombre: string;
}

export interface CreateRolRequest {
  Rol_ID: number;
  Nombre: string;
}

export interface RolResponse {
  message: string;
  id: number;
}

/**
 * Servicio para operaciones de roles
 */
export class RolService {
  private static readonly BASE_PATH = '/roles';

  /**
   * Crear un nuevo rol
   */
  static async crear(rolData: CreateRolRequest): Promise<RolResponse> {
    try {
      const response = await apiClient.post<RolResponse>(
        this.BASE_PATH,
        rolData
      );
      return response.data;
    } catch (error) {
      throw new Error('Error al crear el rol');
    }
  }

  /**
   * Obtener todos los roles
   */
  static async getAll(): Promise<Rol[]> {
    try {
      const response = await apiClient.get<Rol[]>(this.BASE_PATH);
      return response.data;
    } catch (error) {
      throw new Error('Error al obtener roles');
    }
  }

  /**
   * Obtener rol por ID
   */
  static async getById(id: number): Promise<Rol> {
    try {
      const response = await apiClient.get<Rol>(`${this.BASE_PATH}/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('Rol no encontrado');
    }
  }

  /**
   * Actualizar rol
   */
  static async update(id: number, rolData: Partial<CreateRolRequest>): Promise<Rol> {
    try {
      const response = await apiClient.put<Rol>(
        `${this.BASE_PATH}/${id}`,
        rolData
      );
      return response.data;
    } catch (error) {
      throw new Error('Error al actualizar rol');
    }
  }

  /**
   * Eliminar rol
   */
  static async delete(id: number): Promise<void> {
    try {
      await apiClient.delete(`${this.BASE_PATH}/${id}`);
    } catch (error) {
      throw new Error('Error al eliminar rol');
    }
  }

  /**
   * Obtener roles disponibles para selección
   */
  static async getRolesForSelect(): Promise<Array<{ value: number; label: string }>> {
    try {
      const roles = await this.getAll();
      return roles.map(rol => ({
        value: rol.Rol_ID,
        label: rol.Nombre
      }));
    } catch (error) {
      throw new Error('Error al obtener roles para selección');
    }
  }
}
