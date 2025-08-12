"use client";

import React from 'react';
import { DashboardLayout, StatCard, Button, Card } from '@/components';

const DashboardPage = () => {
  const statsData = [
    {
      title: 'Total Recolectado',
      value: '2,543 kg',
      subtitle: 'Material reciclable',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v4H8V5z" />
        </svg>
      ),
      trend: { value: 12, isPositive: true },
      color: 'primary' as const
    },
    {
      title: 'Recolecciones Activas',
      value: '47',
      subtitle: 'En proceso',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      trend: { value: 8, isPositive: true },
      color: 'secondary' as const
    },
    {
      title: 'Usuarios Registrados',
      value: '1,284',
      subtitle: 'Total de usuarios',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      ),
      trend: { value: 5, isPositive: true },
      color: 'accent' as const
    },
    {
      title: 'Impacto Ambiental',
      value: '3.2 ton CO₂',
      subtitle: 'Reducción estimada',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      trend: { value: 15, isPositive: true },
      color: 'success' as const
    }
  ];

  const recentActivity = [
    { id: 1, action: 'Nueva recolección registrada', location: 'Parque Central', time: 'Hace 2 horas', type: 'recoleccion' },
    { id: 2, action: 'Usuario registrado', location: 'Ana García', time: 'Hace 4 horas', type: 'usuario' },
    { id: 3, action: 'Recolección completada', location: 'Zona Industrial', time: 'Hace 6 horas', type: 'completado' },
    { id: 4, action: 'Material procesado', location: '150kg Plástico', time: 'Hace 8 horas', type: 'procesado' }
  ];

  const headerActions = (
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
      <Button variant="outline" size="sm" className="w-full sm:w-auto">
        Exportar Datos
      </Button>
      <Button size="sm" className="w-full sm:w-auto">
        Nueva Recolección
      </Button>
    </div>
  );

  return (
    <DashboardLayout 
      title="Dashboard" 
      subtitle="Panel de control de EcoRecolección"
      headerActions={headerActions}
    >
      <div className="space-y-4 sm:space-y-6">
        {/* Estadísticas principales */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {statsData.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Sección de gráficos y actividad reciente */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Gráfico de recolecciones */}
          <Card className="lg:col-span-2 dashboard-card" padding="lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Recolecciones por Mes
            </h3>
            <div className="h-48 sm:h-64 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg flex items-center justify-center border border-green-100">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-eco-primary/10 rounded-full flex items-center justify-center">
                  <svg className="h-6 w-6 text-eco-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <p className="text-gray-600 font-medium">Gráfico de recolecciones</p>
                <p className="text-sm text-gray-500">Próximamente disponible</p>
              </div>
            </div>
          </Card>

          {/* Actividad reciente */}
          <Card className="dashboard-card" padding="lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Actividad Reciente
            </h3>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                    activity.type === 'recoleccion' ? 'bg-eco-primary' :
                    activity.type === 'usuario' ? 'bg-eco-secondary' :
                    activity.type === 'completado' ? 'bg-green-500' :
                    'bg-eco-accent'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.action}
                    </p>
                    <p className="text-sm text-gray-500">
                      {activity.location}
                    </p>
                    <p className="text-xs text-gray-400">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <Button variant="ghost" size="sm" className="w-full">
                Ver todas las actividades
              </Button>
            </div>
          </Card>
        </div>

        {/* Sección de acciones rápidas */}
        <Card className="dashboard-card" padding="lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Acciones Rápidas
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <Button variant="outline" className="h-16 sm:h-20 flex-col p-3">
              <svg className="h-5 w-5 sm:h-6 sm:w-6 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span className="text-xs sm:text-sm font-medium">Nueva Recolección</span>
            </Button>
            <Button variant="outline" className="h-16 sm:h-20 flex-col p-3">
              <svg className="h-5 w-5 sm:h-6 sm:w-6 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="text-xs sm:text-sm font-medium">Gestionar Usuarios</span>
            </Button>
            <Button variant="outline" className="h-16 sm:h-20 flex-col p-3">
              <svg className="h-5 w-5 sm:h-6 sm:w-6 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span className="text-xs sm:text-sm font-medium">Ver Reportes</span>
            </Button>
            <Button variant="outline" className="h-16 sm:h-20 flex-col p-3">
              <svg className="h-5 w-5 sm:h-6 sm:w-6 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-xs sm:text-sm font-medium">Configuración</span>
            </Button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
