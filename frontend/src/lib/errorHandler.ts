import { AxiosError } from 'axios';

/**
 * Interfaz para errores del backend
 */
interface BackendError {
  error: string;
  message?: string;
  details?: unknown;
}

/**
 * Extrae el mensaje de error específico del backend desde una respuesta de Axios
 * @param error - Error capturado del try/catch
 * @returns Mensaje de error específico
 */
export function extractBackendErrorMessage(error: unknown): string {
  // Log para debugging en desarrollo
  if (process.env.NODE_ENV === 'development') {
    console.error('Error completo:', error);
  }
  
  // Mensaje por defecto
  const defaultErrorMessage = 'Error inesperado. Por favor, inténtalo de nuevo.';
  
  // Verificar si es un error de Axios
  if (error && typeof error === 'object' && 'isAxiosError' in error) {
    const axiosError = error as AxiosError<BackendError>;
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Respuesta del error:', axiosError.response?.data);
      console.log('Status del error:', axiosError.response?.status);
      console.log('Headers del error:', axiosError.response?.headers);
    }
    
    // 1. Priorizar el mensaje específico del backend
    if (axiosError.response?.data?.error) {
      return axiosError.response.data.error;
    }
    
    // 2. Mensaje alternativo del backend
    if (axiosError.response?.data?.message) {
      return axiosError.response.data.message;
    }
    
    // 3. Mensajes basados en código de estado HTTP
    if (axiosError.response?.status) {
      switch (axiosError.response.status) {
        case 400:
          return 'Los datos enviados no son válidos. Verifica la información.';
        case 401:
          return 'No tienes autorización para realizar esta acción.';
        case 403:
          return 'No tienes permisos para realizar esta acción.';
        case 404:
          return 'El recurso solicitado no fue encontrado.';
        case 409:
          return 'Ya existe un registro con esos datos.';
        case 422:
          return 'Los datos enviados no pueden ser procesados.';
        case 500:
          return 'Error interno del servidor. Inténtalo más tarde.';
        case 502:
          return 'El servidor no está disponible. Inténtalo más tarde.';
        case 503:
          return 'El servicio no está disponible temporalmente.';
        default:
          return `Error del servidor (código ${axiosError.response.status})`;
      }
    }
    
    // 4. Error de conexión/red
    if (axiosError.code === 'ECONNREFUSED' || axiosError.code === 'ERR_NETWORK') {
      return 'No se puede conectar al servidor. Verifica tu conexión a internet.';
    }
    
    // 5. Timeout
    if (axiosError.code === 'ECONNABORTED') {
      return 'La petición tardó demasiado. Inténtalo de nuevo.';
    }
    
    // 6. Mensaje general de Axios
    if (axiosError.message) {
      return axiosError.message;
    }
  }
  
  // Error genérico de JavaScript
  if (error instanceof Error) {
    return error.message;
  }
  
  return defaultErrorMessage;
}

/**
 * Wrapper para llamadas de API que maneja errores automáticamente
 * @param apiCall - Función que realiza la llamada a la API
 * @returns Resultado de la API o lanza un error con mensaje específico
 */
export async function handleApiCall<T>(apiCall: () => Promise<T>): Promise<T> {
  try {
    return await apiCall();
  } catch (error) {
    const errorMessage = extractBackendErrorMessage(error);
    throw new Error(errorMessage);
  }
}
