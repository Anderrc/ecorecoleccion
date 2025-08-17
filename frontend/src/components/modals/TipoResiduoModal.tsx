'use client';

import React, { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import { Residuo, CreateResiduoRequest } from '@/services/residuoService';

interface TipoResiduoModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (data: CreateResiduoRequest) => Promise<void>;
	tipo?: Residuo | null;
	categorias: string[];
}

const TipoResiduoModal: React.FC<TipoResiduoModalProps> = ({
	isOpen,
	onClose,
	onSubmit,
	tipo,
	categorias,
}) => {
	const [formData, setFormData] = useState({
		nombre: '',
		descripcion: '',
		puntaje_base: 0,
		categoria: '',
		estado: 'activo' as 'activo' | 'inactivo',
	});

	const [errors, setErrors] = useState<Record<string, string>>({});
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Cargar datos del tipo si está editando
	useEffect(() => {
		if (tipo) {
			setFormData({
				nombre: tipo.nombre || '',
				descripcion: tipo.descripcion || '',
				puntaje_base: tipo.puntaje_base || 0,
				categoria: tipo.categoria || '',
				estado: (tipo.estado as 'activo' | 'inactivo') || 'activo',
			});
		} else {
			// Resetear formulario para nuevo tipo
			setFormData({
				nombre: '',
				descripcion: '',
				puntaje_base: 0,
				categoria: '',
				estado: 'activo',
			});
		}
		setErrors({});
	}, [tipo, isOpen]);

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
		>,
	) => {
		const { name, value } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: name === 'puntaje_base' ? parseFloat(value) || 0 : value,
		}));

		// Limpiar error si existe
		if (errors[name]) {
			setErrors(prev => ({ ...prev, [name]: '' }));
		}
	};

	const validateForm = () => {
		const newErrors: Record<string, string> = {};

		if (!formData.nombre.trim()) {
			newErrors.nombre = 'El nombre es obligatorio';
		}

		if (!formData.categoria.trim()) {
			newErrors.categoria = 'La categoría es obligatoria';
		}

		if (formData.puntaje_base < 0) {
			newErrors.puntaje_base = 'El puntaje base no puede ser negativo';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) return;

		setIsSubmitting(true);
		try {
			await onSubmit(formData);
			onClose();
		} catch (error) {
			console.error('Error al enviar formulario:', error);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleClose = () => {
		if (!isSubmitting) {
			onClose();
		}
	};

	const categoriaOptions = [
		{ value: '', label: 'Seleccionar categoría' },
		...categorias.map(cat => ({ value: cat, label: cat })),
		{ value: 'nueva', label: '+ Nueva categoría' },
	];

	const estadoOptions = [
		{ value: 'activo', label: 'Activo' },
		{ value: 'inactivo', label: 'Inactivo' },
	];

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-opacity-50 backdrop-blur-sm">
			<div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto">
				<div className="flex items-center justify-between p-6 border-b border-gray-200">
					<h2 className="text-xl font-semibold text-gray-900">
						{tipo
							? 'Editar Tipo de Residuo'
							: 'Nuevo Tipo de Residuo'}
					</h2>
					<button
						onClick={handleClose}
						disabled={isSubmitting}
						className="text-gray-400 hover:text-gray-600 transition-colors"
					>
						<svg
							className="w-6 h-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>
				</div>

				<div className="p-6">
					<form onSubmit={handleSubmit} className="space-y-6">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="md:col-span-2">
								<Input
									label="Nombre del tipo de residuo"
									name="nombre"
									value={formData.nombre}
									onChange={handleChange}
									error={errors.nombre}
									placeholder="Ej: Plástico PET"
									required
								/>
							</div>

							<div className="md:col-span-2">
								<Textarea
									label="Descripción"
									name="descripcion"
									value={formData.descripcion}
									onChange={handleChange}
									placeholder="Descripción del tipo de residuo..."
									rows={3}
									resize={false}
								/>
							</div>

							<div>
								<Input
									label="Puntaje base"
									name="puntaje_base"
									type="number"
									min="0"
									step="0.01"
									value={formData.puntaje_base.toString()}
									onChange={handleChange}
									error={errors.puntaje_base}
									placeholder="0.00"
									required
								/>
							</div>

							<div>
								<Select
									label="Categoría"
									name="categoria"
									value={formData.categoria}
									onChange={handleChange}
									options={categoriaOptions}
									error={errors.categoria}
									required
								/>
							</div>

							<div>
								<Select
									label="Estado"
									name="estado"
									value={formData.estado}
									onChange={handleChange}
									options={estadoOptions}
									required
								/>
							</div>
						</div>

						<div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
							<Button
								type="button"
								variant="outline"
								onClick={handleClose}
								disabled={isSubmitting}
							>
								Cancelar
							</Button>
							<Button
								type="submit"
								disabled={isSubmitting}
								className="bg-green-600 hover:bg-green-700"
							>
								{isSubmitting
									? 'Guardando...'
									: tipo
									? 'Actualizar'
									: 'Crear'}
							</Button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default TipoResiduoModal;

