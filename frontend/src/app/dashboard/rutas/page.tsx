'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { RoleBasedLayout } from '@/components/layouts/RoleBasedLayout';
import { RoleGuard } from '@/components/guards/RoleGuard';
import { UserRole } from '@/types/roles';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';

import { RutaService, Ruta as BackendRuta, RutaPunto } from '@/services/rutaService';

// Extender para permitir campos opcionales usados en UI legacy
interface Ruta extends BackendRuta {
  descripcion?: string;
  fechaAsignacion?: string;
}

const RutasRecoleccionPage = () => {
  const [rutas, setRutas] = useState<Ruta[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadRutas = useCallback(async (buscar?: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await RutaService.listar(buscar);
  const maybeData = data as unknown;
  const rutasData = (maybeData as { rutas?: Ruta[] })?.rutas ?? (maybeData as Ruta[]);
  setRutas(rutasData);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Error al cargar rutas';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRutas();
  }, [loadRutas]);

  const filteredRutas = rutas.filter(ruta =>
    ruta.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'asignada':
        return 'bg-yellow-100 text-yellow-800';
      case 'en_progreso':
        return 'bg-blue-100 text-blue-800';
      case 'completada':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEstadoPuntoColor = (estado: string) => {
    switch (estado) {
      case 'pendiente':
        return 'bg-gray-100 text-gray-800';
      case 'en_proceso':
        return 'bg-blue-100 text-blue-800';
      case 'completado':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEstadoText = (estado: string) => {
    switch (estado) {
      case 'asignada':
        return 'Asignada';
      case 'en_progreso':
        return 'En Progreso';
      case 'completada':
        return 'Completada';
      case 'pendiente':
        return 'Pendiente';
      case 'en_proceso':
        return 'En Proceso';
      case 'completado':
        return 'Completado';
      default:
        return estado;
    }
  };

  return (
    <RoleGuard allowedRoles={[UserRole.RECOLECTOR, UserRole.ADMIN]}>
      <RoleBasedLayout>
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Rutas de Recolección</h1>
            <p className="text-gray-600">Gestiona las rutas asignadas para recolección</p>
          </div>

          {/* Buscador */}
          <div className="mb-6">
            <div className="max-w-md">
              <Input
                type="text"
                placeholder="Buscar rutas..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Lista de rutas */}
          <div className="grid gap-6">
            {filteredRutas.map((ruta) => (
              <Card key={ruta.id} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{ruta.nombre}</h3>
                    {ruta.descripcion && <p className="text-gray-600">{ruta.descripcion}</p>}
                    <p className="text-sm text-gray-500 mt-1">
                      {/* Campo de recolector podría agregarse si backend lo provee */}
                      {/* Asignado a: {ruta.recolector?.nombre} {ruta.recolector?.apellidos} */}
                    </p>
                    {ruta.fecha && (
                      <p className="text-sm text-gray-500">
                        Fecha: {new Date(ruta.fecha).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${getEstadoColor(ruta.estado)}`}>
                    {getEstadoText(ruta.estado)}
                  </span>
                </div>

                {/* Puntos de recolección */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-3">
                    Puntos de Recolección ({ruta.puntos?.length || 0})
                  </h4>
                  <div className="space-y-3">
                    {ruta.puntos?.map((punto: RutaPunto, index: number) => (
                      <div key={punto.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-transparent hover:border-green-200 transition-colors">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{punto.direccion}</p>
                            {punto.solicitud_id && (
                              <span className="inline-flex items-center px-2 py-0.5 mt-1 rounded text-xs font-medium bg-blue-100 text-blue-700">
                                Solicitud #{punto.solicitud_id}
                              </span>
                            )}
                            {(punto.latitud || punto.longitud) && (
                              <p className="text-xs text-gray-500">
                                Coordenadas: {punto.latitud}, {punto.longitud}
                              </p>
                            )}
                          </div>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getEstadoPuntoColor(punto.estado || '')}`}>
                          {getEstadoText(punto.estado || '')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Progreso */}
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progreso</span>
                    <span>
                      {ruta.puntos?.filter(p => p.estado === 'completado').length || 0} de {ruta.puntos?.length || 0} completados
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${ruta.puntos && ruta.puntos.length > 0 ? (ruta.puntos.filter(p => p.estado === 'completado').length / ruta.puntos.length) * 100 : 0}%`
                      }}
                    ></div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          {loading && (
            <div className="text-center py-8 text-gray-500">Cargando rutas...</div>
          )}
          {error && (
            <div className="text-center py-8 text-red-500">{error}</div>
          )}
          {!loading && !error && filteredRutas.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No se encontraron rutas</p>
            </div>
          )}
        </div>
      </RoleBasedLayout>
    </RoleGuard>
  );
};

export default RutasRecoleccionPage;
