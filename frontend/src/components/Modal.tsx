'use client';

import React from 'react';
import Button from './ui/Button';

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	message: string;
	type: 'success' | 'error';
	primaryButtonText?: string;
	onPrimaryAction?: () => void;
	showSecondaryButton?: boolean;
	secondaryButtonText?: string;
}

export const Modal: React.FC<ModalProps> = ({
	isOpen,
	onClose,
	title,
	message,
	type,
	primaryButtonText = 'Aceptar',
	onPrimaryAction,
	showSecondaryButton = false,
	secondaryButtonText = 'Cancelar',
}) => {
	if (!isOpen) return null;

	const handlePrimaryClick = () => {
		if (onPrimaryAction) {
			onPrimaryAction();
		} else {
			onClose();
		}
	};

	const getIconColor = () => {
		return type === 'success' ? 'text-green-500' : 'text-red-500';
	};

	const getIcon = () => {
		if (type === 'success') {
			return (
				<svg
					className="w-12 h-12 mx-auto mb-4"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M5 13l4 4L19 7"
					/>
				</svg>
			);
		} else {
			return (
				<svg
					className="w-12 h-12 mx-auto mb-4"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M6 18L18 6M6 6l12 12"
					/>
				</svg>
			);
		}
	};

	return (
		<div
			className="fixed inset-0 flex items-center justify-center z-50"
			style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
		>
			<div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-6 w-full max-w-md mx-4 transform transition-all duration-300 scale-100">
				<div className="text-center">
					{/* Icono */}
					<div className={getIconColor()}>{getIcon()}</div>

					{/* Título */}
					<h3 className="text-xl font-semibold text-gray-800 mb-2">
						{title}
					</h3>

					{/* Mensaje */}
					<p className="text-gray-600 mb-6 leading-relaxed">
						{message}
					</p>

					{/* Botones */}
					<div className="flex gap-3 justify-center">
						{showSecondaryButton && (
							<Button
								variant="outline"
								onClick={onClose}
								className="flex-1"
							>
								{secondaryButtonText}
							</Button>
						)}
						<Button
							variant={type === 'success' ? 'primary' : 'outline'}
							onClick={handlePrimaryClick}
							className={`flex-1 ${
								type === 'error'
									? 'border-red-500 text-red-500 hover:bg-red-50'
									: ''
							}`}
						>
							{primaryButtonText}
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

