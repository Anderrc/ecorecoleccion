import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

/**
 * Singleton API Client usando Axios
 * Proporciona una instancia configurada de Axios para consumir el backend
 */
class ApiClient {
	private static instance: ApiClient;
	private axiosInstance: AxiosInstance;

	private constructor() {
		this.axiosInstance = axios.create({
			baseURL:
				process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api',
			timeout: 10000,
			headers: {
				'Content-Type': 'application/json',
			},
		});

		this.setupInterceptors();
	}

	/**
	 * Obtiene la instancia singleton del cliente API
	 */
	public static getInstance(): ApiClient {
		if (!ApiClient.instance) {
			ApiClient.instance = new ApiClient();
		}
		return ApiClient.instance;
	}

	/**
	 * Configura interceptores para requests y responses
	 */
	private setupInterceptors(): void {
		// Request interceptor para agregar token de autenticación
		this.axiosInstance.interceptors.request.use(
			config => {
				const token = localStorage.getItem('authToken');
				if (token) {
					config.headers.Authorization = `Bearer ${token}`;
				}
				return config;
			},
			error => {
				return Promise.reject(error);
			},
		);

		// Response interceptor para manejar errores globalmente
		this.axiosInstance.interceptors.response.use(
			response => response,
			error => {
				if (error.response?.status === 401) {
					// Token expirado o inválido
					localStorage.removeItem('authToken');
					window.location.href = '/login';
				}
				return Promise.reject(error);
			},
		);
	}

	/**
	 * Métodos HTTP
	 */
	public async get<T>(
		url: string,
		config?: AxiosRequestConfig,
	): Promise<AxiosResponse<T>> {
		return this.axiosInstance.get<T>(url, config);
	}

	public async post<T, D = unknown>(
		url: string,
		data?: D,
		config?: AxiosRequestConfig,
	): Promise<AxiosResponse<T>> {
		return this.axiosInstance.post<T>(url, data, config);
	}

	public async put<T, D = unknown>(
		url: string,
		data?: D,
		config?: AxiosRequestConfig,
	): Promise<AxiosResponse<T>> {
		return this.axiosInstance.put<T>(url, data, config);
	}

	public async delete<T>(
		url: string,
		config?: AxiosRequestConfig,
	): Promise<AxiosResponse<T>> {
		return this.axiosInstance.delete<T>(url, config);
	}

	public async patch<T, D = unknown>(
		url: string,
		data?: D,
		config?: AxiosRequestConfig,
	): Promise<AxiosResponse<T>> {
		return this.axiosInstance.patch<T>(url, data, config);
	}

	/**
	 * Métodos de utilidad
	 */
	public setAuthToken(token: string): void {
		localStorage.setItem('authToken', token);
	}

	public clearAuthToken(): void {
		localStorage.removeItem('authToken');
	}

	public getBaseURL(): string {
		return this.axiosInstance.defaults.baseURL || '';
	}
}

// Exportar la instancia singleton
export const apiClient = ApiClient.getInstance();

// Exportar tipos útiles
export type { AxiosResponse, AxiosRequestConfig };

