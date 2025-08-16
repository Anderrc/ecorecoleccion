'use client';
import React, { useState } from 'react';
import { Card, Input, Button, Modal } from '@/components';
import { AuthService, CreateUsuarioRequest } from '@/services';
import { useRouter } from 'next/navigation';

interface RegistroUsuarioFormData {
	nombre: string;
	apellidos: string;
	correo: string;
	user_name: string;
	contrasena: string;
}

interface RegistroUsuarioFormProps {
	onSubmit?: (data: RegistroUsuarioFormData) => void;
	onSuccess?: () => void;
}

export const RegistroUsuarioForm: React.FC<RegistroUsuarioFormProps> = ({
	onSubmit,
	onSuccess,
}) => {
	const router = useRouter();
	const [form, setForm] = useState({
		nombre: '',
		apellidos: '',
		correo: '',
		user_name: '',
		contrasena: '',
		confirmContrasena: '',
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [showPasswordTooltip, setShowPasswordTooltip] = useState(false);
	const [showSuccessModal, setShowSuccessModal] = useState(false);
	const [showErrorModal, setShowErrorModal] = useState(false);
	const [modalErrorMessage, setModalErrorMessage] = useState('');
	const [passwordValidation, setPasswordValidation] = useState({
		length: false,
		lowercase: false,
		uppercase: false,
		number: false,
		special: false,
	});

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
	) => {
		const { name, value } = e.target;
		setForm({ ...form, [name]: value });
		
		// Validar contraseña en tiempo real
		if (name === 'contrasena') {
			setPasswordValidation({
				length: value.length >= 8,
				lowercase: /[a-z]/.test(value),
				uppercase: /[A-Z]/.test(value),
				number: /\d/.test(value),
				special: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value),
			});
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError('');
	       if (form.contrasena !== form.confirmContrasena) {
		       setError('Las contraseñas no coinciden');
		       setLoading(false);
		       return;
	       }
	       // Validación de contraseña segura
	       const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
	       if (!passwordRegex.test(form.contrasena)) {
		       setError('La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.');
		       setLoading(false);
		       return;
	       }
		try {
			const userData: RegistroUsuarioFormData = {
				user_name: form.user_name,
				correo: form.correo,
				contrasena: form.contrasena,
				nombre: form.nombre,
				apellidos: form.apellidos,
			};
			
			// Usar el servicio de usuario
			if (onSubmit) {
				await onSubmit(userData);
				setShowSuccessModal(true);
			} else {
				// Registrar directamente con el servicio
				const usuarioData: CreateUsuarioRequest = {
					user_name: userData.user_name,
					correo: userData.correo,
					password: userData.contrasena,
					nombre: userData.nombre,
					apellidos: userData.apellidos,
					rol_id: 3, // Usuario normal por defecto
				};
				
				await AuthService.register(usuarioData);
				
				// Limpiar formulario y mostrar modal de éxito
				setForm({
					nombre: '',
					apellidos: '',
					correo: '',
					user_name: '',
					contrasena: '',
					confirmContrasena: '',
				});
				
				setShowSuccessModal(true);
			}
		} catch (error) {
			console.error('Error completo en registro:', error);
			
			let errorMessage = 'Error al registrar usuario';
			
			if (error instanceof Error) {
				errorMessage = error.message;
				console.log('Mensaje del error:', errorMessage);
			}
			
			setModalErrorMessage(errorMessage);
			setShowErrorModal(true);
		} finally {
			setLoading(false);
		}
	};

	const handleSuccessModalClose = () => {
		setShowSuccessModal(false);
	};

	const handleSuccessContinue = () => {
		setShowSuccessModal(false);
		router.push('/login');
	};

	const handleErrorModalClose = () => {
		setShowErrorModal(false);
		setError(modalErrorMessage); // Mostrar el error en el formulario también
	};

	return (
		<>
			<h1 className="text-3xl font-extrabold text-center text-eco-primary mb-4">EcoRecolección</h1>
			<Card className="max-w-2xl mx-auto card-overlay p-8">
				<h2 className="text-3xl font-bold mb-8 text-eco-primary text-center">
					Registro de Usuario
				</h2>
				<form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<Input
					label="Nombre"
					name="nombre"
					value={form.nombre}
					onChange={handleChange}
					required
					autoComplete="given-name"
				/>
				<Input
					label="Apellidos"
					name="apellidos"
					value={form.apellidos}
					onChange={handleChange}
					required
					autoComplete="family-name"
				/>
				<Input
					label="Correo electrónico"
					name="correo"
					type="email"
					value={form.correo}
					onChange={handleChange}
					required
					autoComplete="email"
					className="md:col-span-2"
				/>
				<Input
					label="Nombre de usuario"
					name="user_name"
					value={form.user_name}
					onChange={handleChange}
					required
					autoComplete="username"
				/>
				<div className="relative">
					<Input
						label="Contraseña"
						name="contrasena"
						type="password"
						value={form.contrasena}
						onChange={handleChange}
						onFocus={() => setShowPasswordTooltip(true)}
						onBlur={() => setShowPasswordTooltip(false)}
						required
						autoComplete="new-password"
					/>
					{form.contrasena && showPasswordTooltip && (
						<div className="absolute z-10 left-0 top-full mt-2 p-3 bg-white rounded-lg shadow-lg border border-gray-200 min-w-[250px]">
							<div className="text-xs space-y-1">
								<div className={`flex items-center ${passwordValidation.length ? 'text-green-600' : 'text-red-600'}`}>
									<span className="mr-2">{passwordValidation.length ? '✓' : '✗'}</span>
									Al menos 8 caracteres
								</div>
								<div className={`flex items-center ${passwordValidation.lowercase ? 'text-green-600' : 'text-red-600'}`}>
									<span className="mr-2">{passwordValidation.lowercase ? '✓' : '✗'}</span>
									Una letra minúscula
								</div>
								<div className={`flex items-center ${passwordValidation.uppercase ? 'text-green-600' : 'text-red-600'}`}>
									<span className="mr-2">{passwordValidation.uppercase ? '✓' : '✗'}</span>
									Una letra mayúscula
								</div>
								<div className={`flex items-center ${passwordValidation.number ? 'text-green-600' : 'text-red-600'}`}>
									<span className="mr-2">{passwordValidation.number ? '✓' : '✗'}</span>
									Un número
								</div>
								<div className={`flex items-center ${passwordValidation.special ? 'text-green-600' : 'text-red-600'}`}>
									<span className="mr-2">{passwordValidation.special ? '✓' : '✗'}</span>
									Un carácter especial
								</div>
							</div>
						</div>
					)}
				</div>
				<Input
					label="Confirmar contraseña"
					name="confirmContrasena"
					type="password"
					value={form.confirmContrasena}
					onChange={handleChange}
					required
					autoComplete="new-password"
					className="md:col-span-2"
				/>
				{error && (
					<div className="text-red-600 text-sm md:col-span-2">{error}</div>
				)}
				<div className="md:col-span-2 flex justify-center">
					<Button type="submit" className="w-full max-w-xs" disabled={loading}>
						{loading ? 'Registrando...' : 'Registrarse'}
					</Button>
				</div>
			</form>
				</Card>

				{/* Modal de Éxito */}
				<Modal
					isOpen={showSuccessModal}
					onClose={handleSuccessModalClose}
					title="¡Registro Exitoso!"
					message="Tu cuenta ha sido creada correctamente. Ya puedes iniciar sesión con tus credenciales."
					type="success"
					primaryButtonText="Continuar"
					onPrimaryAction={handleSuccessContinue}
				/>

				{/* Modal de Error */}
				<Modal
					isOpen={showErrorModal}
					onClose={handleErrorModalClose}
					title="Error en el Registro"
					message={modalErrorMessage || "Ha ocurrido un error durante el registro. Por favor, inténtalo de nuevo."}
					type="error"
					primaryButtonText="Cerrar"
				/>
			</>
		);
};

export default RegistroUsuarioForm;

