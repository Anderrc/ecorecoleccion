'use client';

import React, { useState, useEffect } from 'react';
import { RoleBasedLayout } from '@/components/layouts/RoleBasedLayout';
// Removed AdminGuard to allow acceso también a recolectores
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import {
	RecoleccionService,
	Recoleccion as RecoleccionApi,
} from '@/services/recoleccionService';
import { usePermissions } from '@/hooks/usePermissions';

// Adaptamos a lo que devuelve el backend actual (ver recoleccionService)
interface RecoleccionRow {
	id: number;
	nombre: string;
	fecha: string; // Fecha_Recol
	estado: 'pendiente' | 'en_proceso' | 'completada';
	residuo: string;
	residuo_id: number;
	ruta_id?: number | null;
	ruta_nombre?: string | null;
	usuario_nombre?: string;
	usuario_apellidos?: string;
	usuario_username?: string;
}

const GestionRecoleccionesPage = () => {
	const [recolecciones, setRecolecciones] = useState<RecoleccionRow[]>([]);
	const [filteredRecolecciones, setFilteredRecolecciones] = useState<
		RecoleccionRow[]
	>([]);
	const { isAdmin, isRecolector } = usePermissions();
	const [searchTerm, setSearchTerm] = useState('');
	const [statusFilter, setStatusFilter] = useState<string>('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	const loadData = async () => {
		setLoading(true);
		setError('');
		try {
			const res = await RecoleccionService.listar();
			const data = res.data as RecoleccionApi[];
			setRecolecciones(
				data.map(r => ({
					id: r.id,
					nombre: r.nombre,
					fecha: r.fecha,
					estado: r.estado,
					residuo: r.residuo,
					residuo_id: r.residuo_id,
					ruta_id: r.ruta_id ?? null,
					ruta_nombre: r.ruta_nombre ?? null,
					usuario_nombre: r.usuario_nombre,
					usuario_apellidos: r.usuario_apellidos,
					usuario_username: r.usuario_username,
				})),
			);
		} catch (e) {
			const msg =
				e instanceof Error ? e.message : 'Error cargando recolecciones';
			setError(msg);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadData();
	}, []);

	// Filtrar recolecciones
	useEffect(() => {
		let filtered = recolecciones;

		if (searchTerm) {
			const term = searchTerm.toLowerCase();
			filtered = filtered.filter(
				r =>
					r.nombre.toLowerCase().includes(term) ||
					r.residuo.toLowerCase().includes(term) ||
					(r.ruta_id ? String(r.ruta_id).includes(term) : false),
			);
		}

		if (statusFilter) {
			filtered = filtered.filter(
				recoleccion => recoleccion.estado === statusFilter,
			);
		}

		setFilteredRecolecciones(filtered);
	}, [searchTerm, statusFilter, recolecciones]);

	const handleStatusChange = async (id: number, newStatus: string) => {
		if (!['pendiente', 'en_proceso', 'completada'].includes(newStatus))
			return;
		try {
			await RecoleccionService.actualizarEstado(
				id,
				newStatus as 'pendiente' | 'en_proceso' | 'completada',
			);
			setRecolecciones(prev =>
				prev.map(r =>
					r.id === id
						? {
								...r,
								estado: newStatus as RecoleccionRow['estado'],
						  }
						: r,
				),
			);
		} catch {
			alert('No se pudo actualizar estado');
		}
	};

	const getStatusColor = (estado: string) => {
		switch (estado) {
			case 'pendiente':
				return 'bg-yellow-100 text-yellow-800';
			case 'en_proceso':
				return 'bg-blue-100 text-blue-800';
			case 'completada':
				return 'bg-green-100 text-green-800';
			case 'cancelada':
				return 'bg-red-100 text-red-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	};

	const getStatusText = (estado: string) => {
		switch (estado) {
			case 'pendiente':
				return 'Pendiente';
			case 'en_proceso':
				return 'En Proceso';
			case 'completada':
				return 'Completada';
			case 'cancelada':
				return 'Cancelada';
			default:
				return estado;
		}
	};

	if (!isAdmin() && !isRecolector()) {
		return (
			<RoleBasedLayout>
				<div className="p-6">
					<h1 className="text-xl font-semibold mb-4">
						Recolecciones
					</h1>
					<p className="text-sm text-gray-600">
						No tienes permisos para ver esta sección.
					</p>
				</div>
			</RoleBasedLayout>
		);
	}

	return (
		<RoleBasedLayout>
			<div className="p-6">
				<div className="mb-6">
					<h1 className="text-2xl font-bold text-gray-900">
						Recolecciones
					</h1>
					<p className="text-gray-600">
						{isAdmin()
							? 'Administra todas las recolecciones del sistema'
							: 'Registros de recolecciones asociadas a tus operaciones'}
					</p>
					<div className="mt-2 flex gap-2">
						<Button
							type="button"
							onClick={loadData}
							disabled={loading}
						>
							{loading ? 'Actualizando...' : 'Recargar'}
						</Button>
					</div>
				</div>

				{/* Controles superiores */}
				<div className="mb-6 flex flex-col sm:flex-row gap-4">
					<div className="flex-1 max-w-md">
						<Input
							type="text"
							placeholder="Buscar recolecciones..."
							value={searchTerm}
							onChange={(
								e: React.ChangeEvent<HTMLInputElement>,
							) => setSearchTerm(e.target.value)}
						/>
					</div>
					<div className="w-56">
						<Select
							value={statusFilter}
							onChange={(
								e: React.ChangeEvent<HTMLSelectElement>,
							) => setStatusFilter(e.target.value)}
							placeholder="Filtrar estado"
							options={[
								{ value: '', label: 'Todos' },
								{ value: 'pendiente', label: 'Pendiente' },
								{ value: 'en_proceso', label: 'En Proceso' },
								{ value: 'completada', label: 'Completada' },
							]}
						/>
					</div>
				</div>

				{/* Estadísticas rápidas */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
					<Card className="p-4">
						<h3 className="text-sm font-medium text-gray-500">
							Total Recolecciones
						</h3>
						<p className="text-2xl font-bold text-gray-900">
							{recolecciones.length}
						</p>
					</Card>
					<Card className="p-4">
						<h3 className="text-sm font-medium text-gray-500">
							Pendientes
						</h3>
						<p className="text-2xl font-bold text-yellow-600">
							{
								recolecciones.filter(
									r => r.estado === 'pendiente',
								).length
							}
						</p>
					</Card>
					<Card className="p-4">
						<h3 className="text-sm font-medium text-gray-500">
							En Proceso
						</h3>
						<p className="text-2xl font-bold text-blue-600">
							{
								recolecciones.filter(
									r => r.estado === 'en_proceso',
								).length
							}
						</p>
					</Card>
					<Card className="p-4">
						<h3 className="text-sm font-medium text-gray-500">
							Completadas
						</h3>
						<p className="text-2xl font-bold text-green-600">
							{
								recolecciones.filter(
									r => r.estado === 'completada',
								).length
							}
						</p>
					</Card>
				</div>

				{/* Tabla de recolecciones */}
				<Card className="p-0 overflow-hidden">
					<div className="overflow-x-auto">
						<table className="min-w-full divide-y divide-gray-200">
							<thead className="bg-gray-50">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										ID
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Usuario
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Fecha
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Residuo
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Estado
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Acciones
									</th>
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-gray-200">
								{filteredRecolecciones.map(recoleccion => (
									<tr
										key={recoleccion.id}
										className="hover:bg-gray-50"
									>
										<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
											#{recoleccion.id}
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="text-sm text-gray-900">
												{recoleccion.usuario_nombre}{' '}
												{recoleccion.usuario_apellidos}
											</div>
											{recoleccion.usuario_username && (
												<div className="text-xs text-gray-500">
													@
													{
														recoleccion.usuario_username
													}
												</div>
											)}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
											{new Date(
												recoleccion.fecha,
											).toLocaleDateString()}
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="text-sm text-gray-900">
												{recoleccion.residuo}
											</div>
											{recoleccion.ruta_id && (
												<div className="text-xs text-gray-500">
													Ruta:{' '}
													{recoleccion.ruta_nombre ||
														`#${recoleccion.ruta_id}`}
												</div>
											)}
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<span
												className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
													recoleccion.estado,
												)}`}
											>
												{getStatusText(
													recoleccion.estado,
												)}
											</span>
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
											<div className="min-w-[140px]">
												<Select
													value={recoleccion.estado}
													onChange={(
														e: React.ChangeEvent<HTMLSelectElement>,
													) =>
														handleStatusChange(
															recoleccion.id,
															e.target.value,
														)
													}
													options={[
														{
															value: 'pendiente',
															label: 'Pendiente',
														},
														{
															value: 'en_proceso',
															label: 'En Proceso',
														},
														{
															value: 'completada',
															label: 'Completada',
														},
													]}
												/>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</Card>

				{error && <p className="text-sm text-red-600 mt-4">{error}</p>}
				{!loading && filteredRecolecciones.length === 0 && !error && (
					<div className="text-center py-8">
						<p className="text-gray-500">
							No se encontraron recolecciones
						</p>
					</div>
				)}
			</div>
		</RoleBasedLayout>
	);
};

export default GestionRecoleccionesPage;

