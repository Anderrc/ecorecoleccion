'use client';

import Link from 'next/link';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { RoleBasedLayout } from '@/components/layouts/RoleBasedLayout';
import StatCard from '@/components/StatCard';
import { useEffect, useState } from 'react';
import { DashboardService, GlobalDashboardStats, PersonalStats } from '@/services/dashboardService';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/hooks/usePermissions';
import { PermissionGuard } from '@/components/guards/RoleGuard';
import { ROLE_NAMES } from '@/types/roles';

const DashboardPage = () => {
	const { user } = useAuth();
	const { getUserRole, isAdmin, isUsuario, isRecolector } = usePermissions();
	const [globalStats, setGlobalStats] = useState<GlobalDashboardStats | null>(null);
	const [personalStats, setPersonalStats] = useState<PersonalStats | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	interface DashStat {
		title: string;
		value: string | number;
		subtitle: string;
		icon: React.ReactNode;
		trend?: { value: number; isPositive: boolean } | undefined;
		color: 'primary' | 'secondary' | 'accent' | 'success';
	}
	
	const userRole = getUserRole();

	useEffect(() => {
		const loadStats = async () => {
			try {
				const global = await DashboardService.getGlobalStats();
				setGlobalStats(global);
				if (user) {
					const personal = await DashboardService.getPersonalStats();
					setPersonalStats(personal);
				}
			} catch (e) {
				const err = e as Error;
				setError(err.message || 'Error cargando estadísticas');
			} finally {
				setLoading(false);
			}
		};
		loadStats();
	}, [user]);

	// Construcción dinámica de tarjetas según rol
	const getStatsForRole = (): DashStat[] => {
		if (loading) {
			return [
				{ title: 'Cargando...', value: '...', subtitle: 'Obteniendo datos', icon: <span /> , trend: undefined, color: 'primary' as const }
			];
		}

		if (error) {
			return [
				{ title: 'Error', value: '-', subtitle: error, icon: <span /> , trend: undefined, color: 'accent' as const }
			];
		}

		if (isAdmin()) {
			return [
				{
					title: 'Usuarios Registrados',
					value: globalStats?.usuarios.total ?? 0,
					subtitle: `Admins: ${globalStats?.usuarios.admins || 0} · Recolectores: ${globalStats?.usuarios.recolectores || 0}`,
					icon: (
						<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
						</svg>
					),
					color: 'secondary' as const,
				},
				{
					title: 'Tipos de Residuos',
					value: globalStats?.residuos.total ?? 0,
					subtitle: `Activos ${globalStats?.residuos.activos || 0} · Categorías ${globalStats?.residuos.categorias || 0}`,
					icon: (
						<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
						</svg>
					),
					color: 'primary' as const,
				},
				{
					title: 'Recolecciones Hoy',
					value: globalStats?.recolecciones.hoy ?? 0,
					subtitle: `Pendientes ${globalStats?.recolecciones.pendientes || 0} · Completadas ${globalStats?.recolecciones.completadas || 0}`,
					icon: (
						<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
						</svg>
					),
					color: 'accent' as const,
				},
			];
		}

		if (isUsuario()) {
			return [
				{
					title: 'Mis Solicitudes',
					value: personalStats?.solicitudes.total ?? 0,
					subtitle: `Pendientes ${personalStats?.solicitudes.pendientes || 0}`,
					icon: (
						<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
						</svg>
					),
					color: 'accent' as const,
				},
				{
					title: 'Mis Recolecciones',
					value: personalStats?.recolecciones.total ?? 0,
					subtitle: 'Histórico',
					icon: (
						<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
						</svg>
					),
					color: 'primary' as const,
				},
			];
		}

		if (isRecolector()) {
			return [
				{
					title: 'Recolecciones Hoy',
					value: globalStats?.recolecciones.hoy ?? 0,
					subtitle: `Pendientes ${globalStats?.recolecciones.pendientes || 0}`,
					icon: (
						<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
						</svg>
					),
					color: 'primary' as const,
				},
				{
					title: 'Recolecciones Totales',
					value: globalStats?.recolecciones.total ?? 0,
					subtitle: `Completadas ${globalStats?.recolecciones.completadas || 0}`,
					icon: (
						<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
					),
					color: 'success' as const,
				},
			];
		}

		// Default stats
		return [
			{
				title: 'Recolecciones Totales',
				value: globalStats?.recolecciones.total ?? 0,
				subtitle: `Hoy ${globalStats?.recolecciones.hoy || 0}`,
				icon: (
					<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
					</svg>
				),
				color: 'primary' as const,
			},
		];
	};

	const statsData = getStatsForRole();

	const quickActions = () => {
		if (isAdmin()) {
			return (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					<Card className="p-6">
						<h3 className="text-lg font-semibold text-gray-900 mb-2">Gestión de Usuarios</h3>
						<p className="text-gray-600 mb-4">Administrar usuarios del sistema</p>
						<Link href="/dashboard/usuarios">
							<Button size="sm">Ver Usuarios</Button>
						</Link>
					</Card>
					<Card className="p-6">
						<h3 className="text-lg font-semibold text-gray-900 mb-2">Recolecciones</h3>
						<p className="text-gray-600 mb-4">Supervisar recolecciones activas</p>
						<Link href="/dashboard/recolecciones">
							<Button size="sm">Ver Recolecciones</Button>
						</Link>
					</Card>
					<Card className="p-6">
						<h3 className="text-lg font-semibold text-gray-900 mb-2">Tipos de Residuos</h3>
						<p className="text-gray-600 mb-4">Configurar tipos y criterios</p>
						<Link href="/dashboard/tipos-residuos">
							<Button size="sm">Configurar</Button>
						</Link>
					</Card>
				</div>
			);
		}

		if (isUsuario()) {
			return (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					<Card className="p-6">
						<h3 className="text-lg font-semibold text-gray-900 mb-2">Solicitar Recolección</h3>
						<p className="text-gray-600 mb-4">Programa una nueva recolección</p>
						<Link href="/dashboard/solicitar-recoleccion">
							<Button size="sm">Solicitar</Button>
						</Link>
					</Card>
					<Card className="p-6">
						<h3 className="text-lg font-semibold text-gray-900 mb-2">Mis Reportes</h3>
						<p className="text-gray-600 mb-4">Ver historial de recolecciones</p>
						<Link href="/dashboard/reportes">
							<Button size="sm">Ver Reportes</Button>
						</Link>
					</Card>
					<Card className="p-6">
						<h3 className="text-lg font-semibold text-gray-900 mb-2">Códigos de Descuento</h3>
						<p className="text-gray-600 mb-4">Generar códigos de descuento</p>
						<Link href="/dashboard/codigos-descuento">
							<Button size="sm">Generar</Button>
						</Link>
					</Card>
				</div>
			);
		}

		if (isRecolector()) {
			return (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<Card className="p-6">
						<h3 className="text-lg font-semibold text-gray-900 mb-2">Rutas de Recolección</h3>
						<p className="text-gray-600 mb-4">Ver rutas asignadas para hoy</p>
						<Link href="/dashboard/rutas">
							<Button size="sm">Ver Rutas</Button>
						</Link>
					</Card>
					<Card className="p-6">
						<h3 className="text-lg font-semibold text-gray-900 mb-2">Registrar Recolección</h3>
						<p className="text-gray-600 mb-4">Registrar una nueva recolección</p>
						<Link href="/dashboard/registrar-recoleccion">
							<Button size="sm">Registrar</Button>
						</Link>
					</Card>
				</div>
			);
		}

		return null;
	};

	return (
		<ProtectedRoute>
			<RoleBasedLayout>
				<div className="space-y-8">
					{/* Header */}
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
						<div>
							<h1 className="text-3xl font-bold text-gray-900">
								¡Bienvenido, {user?.nombre}!
							</h1>
							<p className="mt-2 text-gray-600">
								Panel de {userRole ? ROLE_NAMES[userRole] : 'Usuario'} - EcoRecolección
							</p>
						</div>
					</div>

					{/* Stats Cards */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{statsData.map((stat, index) => (
							<StatCard
								key={index}
								title={stat.title}
								value={stat.value}
								subtitle={stat.subtitle}
								icon={stat.icon}
								trend={stat.trend}
								color={stat.color}
							/>
						))}
					</div>

					{/* Quick Actions */}
					<div>
						<h2 className="text-xl font-semibold text-gray-900 mb-6">Acciones Rápidas</h2>
						{quickActions()}
					</div>

					{/* Recent Activity - Solo para admin y recolectores */}
					<PermissionGuard action="read" resource="collections">
						<div>
							<h2 className="text-xl font-semibold text-gray-900 mb-6">Actividad Reciente</h2>
							<Card className="p-6">
								<div className="space-y-4">
									<div className="flex items-center justify-between py-3 border-b border-gray-200">
										<div>
											<p className="text-sm font-medium text-gray-900">Recolección completada</p>
											<p className="text-sm text-gray-500">Usuario: Juan Pérez - 15.5 kg plástico</p>
										</div>
										<span className="text-sm text-gray-400">Hace 2 horas</span>
									</div>
									<div className="flex items-center justify-between py-3 border-b border-gray-200">
										<div>
											<p className="text-sm font-medium text-gray-900">Nueva solicitud</p>
											<p className="text-sm text-gray-500">Usuario: María García - Recolección programada</p>
										</div>
										<span className="text-sm text-gray-400">Hace 4 horas</span>
									</div>
									<div className="flex items-center justify-between py-3">
										<div>
											<p className="text-sm font-medium text-gray-900">Puntos otorgados</p>
											<p className="text-sm text-gray-500">Usuario: Carlos López - 45 puntos</p>
										</div>
										<span className="text-sm text-gray-400">Hace 6 horas</span>
									</div>
								</div>
							</Card>
						</div>
					</PermissionGuard>
				</div>
			</RoleBasedLayout>
		</ProtectedRoute>
	);
};

export default DashboardPage;
