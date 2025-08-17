'use client';

import React, { useState, useEffect } from 'react';
import { RoleBasedLayout } from '@/components/layouts/RoleBasedLayout';
import { UsuarioGuard } from '@/components/guards/RoleGuard';
import { Button, Card, Select } from '@/components/ui';
import { ReporteService, RecoleccionReporte, EstadisticasUsuarioReporte } from '@/services/reporteService';
import { useAuth } from '@/contexts/AuthContext';

const ReportesPage = () => {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('ultimo-mes');
  const [selectedType, setSelectedType] = useState('todos');
  const [recolecciones, setRecolecciones] = useState<RecoleccionReporte[]>([]);
  const [estadisticas, setEstadisticas] = useState<EstadisticasUsuarioReporte | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const reports = await ReporteService.obtenerMisRecolecciones({
          period: selectedPeriod !== 'todo' ? selectedPeriod : undefined,
          tipo: selectedType !== 'todos' ? selectedType : undefined
        });
        setRecolecciones(reports);
        const stats = await ReporteService.obtenerEstadisticas({
          period: selectedPeriod !== 'todo' ? selectedPeriod : undefined
        });
        setEstadisticas(stats);
      } catch (e) {
        const err = e as Error;
        setError(err.message || 'Error cargando reportes');
      } finally {
        setLoading(false);
      }
    };
    if (user) loadData();
  }, [user, selectedPeriod, selectedType]);

  const periodOptions = [
    { value: 'ultimo-mes', label: 'Último mes' },
    { value: 'ultimos-3-meses', label: 'Últimos 3 meses' },
    { value: 'ultimo-ano', label: 'Último año' },
    { value: 'todo', label: 'Todo el historial' },
  ];

  const typeOptions = [
    { value: 'todos', label: 'Todos los tipos' },
    { value: 'plastico', label: 'Plástico' },
    { value: 'papel', label: 'Papel y Cartón' },
    { value: 'vidrio', label: 'Vidrio' },
    { value: 'metal', label: 'Metal' },
    { value: 'electronicos', label: 'Electrónicos' },
  ];

  // Filtrar recolecciones según los filtros seleccionados
  const filteredRecolecciones = recolecciones.filter(recoleccion => {
    if (selectedType !== 'todos' && recoleccion.tipoResiduo.toLowerCase() !== selectedType) {
      return false;
    }
    // Aquí se aplicarían los filtros de período
    return true;
  });

  // Calcular estadísticas
  const totalKg = filteredRecolecciones.reduce((sum, r) => sum + (r.cantidadKg || 0), 0);
  const totalPuntos = estadisticas?.totalPuntos ?? filteredRecolecciones.reduce((sum, r) => sum + r.puntosObtenidos, 0);
  const recoleccionesCompletadas = estadisticas?.completadas ?? filteredRecolecciones.filter(r => r.estado === 'completada').length;

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'completada':
        return 'bg-green-100 text-green-800';
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelada':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const exportData = () => {
    // Simulación de exportación de datos
    const csvContent = [
      ['Fecha', 'Tipo Residuo', 'Cantidad (kg)', 'Puntos', 'Estado', 'Recolector'].join(','),
      ...filteredRecolecciones.map(r => 
        [r.fecha, r.tipoResiduo, r.cantidadKg, r.puntosObtenidos, r.estado, r.recolector].join(',')
      )
    ].join('\\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'reporte-recolecciones.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <UsuarioGuard>
      <RoleBasedLayout>
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mis Reportes</h1>
              <p className="mt-2 text-gray-600">
                Historial completo de tus recolecciones y estadísticas
              </p>
            </div>
            <Button onClick={exportData} variant="outline">
              Exportar CSV
            </Button>
          </div>

          {/* Filtros */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Filtros</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Período"
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                options={periodOptions}
              />
              <Select
                label="Tipo de Residuo"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                options={typeOptions}
              />
            </div>
          </Card>

          {/* Estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {loading ? '...' : totalKg.toFixed(1)}
              </div>
              <p className="text-sm text-gray-600">Total Kilos (placeholder)</p>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {loading ? '...' : totalPuntos}
              </div>
              <p className="text-sm text-gray-600">Puntos Obtenidos</p>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {loading ? '...' : recoleccionesCompletadas}
              </div>
              <p className="text-sm text-gray-600">Recolecciones Completadas</p>
            </Card>
          </div>

          {/* Historial de Recolecciones */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Historial de Recolecciones</h2>
            {error && (
              <Card className="p-4 mb-4 bg-red-50 text-red-600 text-sm">{error}</Card>
            )}
            {loading ? (
              <Card className="p-8 text-center"><p className="text-gray-500">Cargando...</p></Card>
            ) : filteredRecolecciones.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-gray-500">No se encontraron recolecciones con los filtros seleccionados</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredRecolecciones.map((recoleccion) => (
                  <Card key={recoleccion.id} className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(recoleccion.estado)}`}>
                            {recoleccion.estado.charAt(0).toUpperCase() + recoleccion.estado.slice(1)}
                          </span>
                          <span className="text-sm text-gray-500">
                            {new Date(recoleccion.fecha).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {recoleccion.tipoResiduo}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                          <div>
                            <p><span className="font-medium">Dirección:</span> {recoleccion.direccion}</p>
                            <p><span className="font-medium">Recolector:</span> {recoleccion.recolector}</p>
                          </div>
                          <div>
                            <p><span className="font-medium">Cantidad:</span> {recoleccion.cantidadKg ?? '-'} kg</p>
                            <p><span className="font-medium">Puntos:</span> {recoleccion.puntosObtenidos}</p>
                          </div>
                        </div>
                        {recoleccion.observaciones && (
                          <div className="mt-2">
                            <span className="text-sm font-medium text-gray-700">Observaciones:</span>
                            <p className="text-sm text-gray-600">{recoleccion.observaciones}</p>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600">
                            +{recoleccion.puntosObtenidos}
                          </div>
                          <p className="text-xs text-gray-500">puntos</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Gráfico de tendencias (placeholder) */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Tendencias Mensuales</h2>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Gráfico de tendencias - Próximamente</p>
            </div>
          </Card>

          {/* Impacto ambiental */}
          <Card className="p-6 bg-green-50">
            <h2 className="text-xl font-semibold text-green-900 mb-4">Tu Impacto Ambiental</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-700">
                  {(totalKg * 2.1).toFixed(1)}
                </div>
                <p className="text-sm text-green-600">kg CO₂ evitados</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-700">
                  {Math.floor(totalKg * 0.8)}
                </div>
                <p className="text-sm text-green-600">litros de agua ahorrados</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-700">
                  {(totalKg * 1.2).toFixed(1)}
                </div>
                <p className="text-sm text-green-600">kWh de energía ahorrados</p>
              </div>
            </div>
          </Card>
        </div>
      </RoleBasedLayout>
    </UsuarioGuard>
  );
};

export default ReportesPage;
