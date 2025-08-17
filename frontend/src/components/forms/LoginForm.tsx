'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Input, Button, Modal } from '@/components';
import { AuthService, LoginRequest } from '@/services';
import { useAuth } from '@/contexts/AuthContext';

export const LoginForm = () => {
	const router = useRouter();

	const { isAuthenticated, isLoading } = useAuth();

	// Si ya está autenticado, redirigir una sola vez
	useEffect(() => {
		if (!isLoading && isAuthenticated) {
			router.replace('/dashboard');
		}
	}, [isAuthenticated, isLoading, router]);

	const [form, setForm] = useState({
		correo: '',
		password: '',
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [showErrorModal, setShowErrorModal] = useState(false);
	const [modalErrorMessage, setModalErrorMessage] = useState('');

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setForm({ ...form, [name]: value });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError('');

		// Validaciones básicas
		if (!form.correo || !form.password) {
			setError('Todos los campos son obligatorios');
			setLoading(false);
			return;
		}

		try {
			const credentials: LoginRequest = {
				correo: form.correo,
				password: form.password,
			};

			const response = await AuthService.login(credentials);

			// Solo guardar y redirigir si el login fue exitoso
			if (response && response.user && response.token) {
				// Guardar información del usuario en localStorage
				localStorage.setItem('user', JSON.stringify(response.user));
				localStorage.setItem('authToken', response.token);
				// En lugar de redirigir inmediatamente, esperamos a que el contexto actualice
				// pero para UX rápida igualmente hacemos replace; si contexto tarda evita loop
				router.replace('/dashboard');

				// Ejecutar callback de éxito si existe
			} else {
				throw new Error('Respuesta inválida del servidor');
			}
		} catch (error) {
			console.error('Error completo en login:', error);
			console.error('Tipo de error:', typeof error);
			console.error('Es instance de Error:', error instanceof Error);

			let errorMessage = 'Error al iniciar sesión';

			if (error instanceof Error) {
				errorMessage = error.message;
				console.log('Mensaje del error extraído:', errorMessage);
			}

			// No redirigir - mostrar el error
			setModalErrorMessage(errorMessage);
			setShowErrorModal(true);

			// También mostrar en el formulario
			setError(errorMessage);
		} finally {
			setLoading(false);
		}
	};

	const handleErrorModalClose = () => {
		setShowErrorModal(false);
		setError(modalErrorMessage); // Mostrar el error en el formulario también
	};

	return (
		<>
			<main className="min-h-screen flex items-center justify-center relative">
				<div
					className="absolute inset-0 bg-cover bg-center filter blur-none"
					style={{
						backgroundImage: "url('/background.jpg')",
					}}
				></div>
				<div className="absolute inset-0 bg-green-800/20" />

				<Card className="w-full max-w-md mx-4 card-overlay p-8 relative z-10">
					<header className="mb-6 text-center">
						<svg
							className="mx-auto mb-3 w-10 h-10 text-green-500"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							viewBox="0 0 30 30"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="m20.893 13.393-1.135-1.135a2.252 2.252 0 0 1-.421-.585l-1.08-2.16a.414.414 0 0 0-.663-.107.827.827 0 0 1-.812.21l-1.273-.363a.89.89 0 0 0-.738 1.595l.587.39c.59.395.674 1.23.172 1.732l-.2.2c-.212.212-.33.498-.33.796v.41c0 .409-.11.809-.32 1.158l-1.315 2.191a2.11 2.11 0 0 1-1.81 1.025 1.055 1.055 0 0 1-1.055-1.055v-1.172c0-.92-.56-1.747-1.414-2.089l-.655-.261a2.25 2.25 0 0 1-1.383-2.46l.007-.042a2.25 2.25 0 0 1 .29-.787l.09-.15a2.25 2.25 0 0 1 2.37-1.048l1.178.236a1.125 1.125 0 0 0 1.302-.795l.208-.73a1.125 1.125 0 0 0-.578-1.315l-.665-.332-.091.091a2.25 2.25 0 0 1-1.591.659h-.18c-.249 0-.487.1-.662.274a.931.931 0 0 1-1.458-1.137l1.411-2.353a2.25 2.25 0 0 0 .286-.76m11.928 9.869A9 9 0 0 0 8.965 3.525m11.928 9.868A9 9 0 1 1 8.965 3.525"
							/>
						</svg>

						<h1 className="text-2xl font-bold text-eco-primary">
							EcoRecolección
						</h1>
						<h2 className="mt-6 mb-2 text-2xl font-bold text-eco-primary">
							Iniciar sesión
						</h2>
						<p className="text-sm text-gray-600">
							Accede para contribuir al manejo de desechos
							responsable
						</p>
					</header>

					<form onSubmit={handleSubmit} className="space-y-4">
						<Input
							label="Correo electrónico"
							name="correo"
							type="email"
							value={form.correo}
							onChange={handleChange}
							required
							autoComplete="email"
							placeholder="ejemplo@correo.com"
						/>

						<Input
							label="Contraseña"
							name="password"
							type="password"
							value={form.password}
							onChange={handleChange}
							required
							autoComplete="current-password"
							placeholder="••••••••"
						/>

						{error && (
							<div className="text-red-600 text-sm">{error}</div>
						)}

						<Button
							type="submit"
							className="w-full"
							disabled={loading}
						>
							{loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
						</Button>

						<footer className="text-center text-sm text-gray-500 mt-4">
							¿No tienes cuenta?{' '}
							<button
								type="button"
								onClick={() => router.push('/registro')}
								className="text-eco-primary hover:underline"
							>
								Regístrate
							</button>
						</footer>
					</form>
				</Card>

				{/* Modal de Error */}
				<Modal
					isOpen={showErrorModal}
					onClose={handleErrorModalClose}
					title="Error al Iniciar Sesión"
					message={
						modalErrorMessage ||
						'Ha ocurrido un error al iniciar sesión. Por favor, verifica tus credenciales.'
					}
					type="error"
					primaryButtonText="Cerrar"
				/>
			</main>
		</>
	);
};

export default LoginForm;

