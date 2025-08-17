import { apiClient } from '@/lib/api';
import { handleApiCall } from '@/lib/errorHandler';

// Interfaces para el usuario
export interface Usuario {
  ID_User: number;
  User_name: string;
  correo: string;
  Nombre: string;
  Apellidos: string;
  Rol_ID: number;
}

export interface CreateUsuarioRequest {
  user_name: string;
  correo: string;
  password: string;
  nombre: string;
  apellidos: string;
  rol_id?: number;
}

export interface LoginRequest {
  correo: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: {
    id: number;
    nombre: string;
    apellidos: string;
    correo: string;
    rol: number;
  };
}

/**
 * Servicio para operaciones de autenticación
 */
export class AuthService {
  /**
   * Verificar si el token es válido
   */
  static async verifyToken(): Promise<AuthResponse> {
    return handleApiCall(async () => {
      const response = await apiClient.get<AuthResponse>('/auth/verify');
      return response.data;
    });
  }

  /**
   * Validar si el token JWT ha expirado
   */
  static isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch (error) {
      console.error('Error al decodificar token:', error);
      return true; // Si no se puede decodificar, considerar expirado
    }
  }

  /**
   * Obtener información del token
   */
  static getTokenInfo(token: string): {
    userId: number;
    email: string;
    role: number;
    exp: number;
    iat: number;
  } | null {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        userId: payload.id,
        email: payload.correo,
        role: payload.rol,
        exp: payload.exp,
        iat: payload.iat
      };
    } catch (error) {
      console.error('Error al decodificar token:', error);
      return null;
    }
  }

  /**
   * Verificar si hay una sesión válida
   */
  static hasValidSession(): boolean {
    if (typeof window === 'undefined') return false;
    
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    
    if (!token || !user) return false;
    
    return !this.isTokenExpired(token);
  }

  /**
   * Limpiar sesión expirada
   */
  static clearExpiredSession(): void {
    if (typeof window === 'undefined') return;
    
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    apiClient.clearAuthToken();
  }

  /**
   * Registrar un nuevo usuario
   */
  static async register(userData: CreateUsuarioRequest): Promise<{ message: string; id: number }> {
    return handleApiCall(async () => {
      const response = await apiClient.post<{ message: string; id: number }>(
        '/auth/register',
        userData
      );
      return response.data;
    });
  }

  /**
   * Iniciar sesión
   */
  static async login(credentials: LoginRequest): Promise<AuthResponse> {
    return handleApiCall(async () => {
      const response = await apiClient.post<AuthResponse>(
        '/auth/login',
        credentials
      );
      
      // Guardar token automáticamente
      if (response.data.token) {
        apiClient.setAuthToken(response.data.token);
      }
      
      return response.data;
    });
  }

  /**
   * Cerrar sesión
   */
  static async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch {
      // Ignorar errores del logout en el servidor
    } finally {
      apiClient.clearAuthToken();
    }
  }
}

/**
 * Servicio para operaciones de usuario (mantengo compatibilidad)
 */
export class UsuarioService {
  /**
   * Registrar un nuevo usuario (alias para AuthService.register)
   */
  static async registrar(userData: CreateUsuarioRequest): Promise<{ message: string; id: number }> {
    return AuthService.register(userData);
  }

  /**
   * Iniciar sesión (alias para AuthService.login)
   */
  static async login(credentials: LoginRequest): Promise<AuthResponse> {
    return AuthService.login(credentials);
  }

  /**
   * Cerrar sesión (alias para AuthService.logout)
   */
  static async logout(): Promise<void> {
    return AuthService.logout();
  }
}
