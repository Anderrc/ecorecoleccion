'use client';

import React, { useState, useEffect } from 'react';
import { RoleBasedLayout } from '@/components/layouts/RoleBasedLayout';
import { UsuarioGuard } from '@/components/guards/RoleGuard';
import { Input, Select, Textarea } from '@/components/ui';
import { ResiduoService, Residuo } from '@/services/residuoService';
import { SolicitudService } from '@/services/solicitudService';
import { useAuth } from '@/contexts/AuthContext';

const SolicitarRecoleccionPage = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    direccion: '',
    tipoResiduo: '',
    cantidadEstimada: '',
    fechaPreferida: '',
    horaPreferida: '',
    observaciones: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const [tiposResiduos, setTiposResiduos] = useState<Residuo[]>([]);
  const [loadingResiduos, setLoadingResiduos] = useState<boolean>(false);
  const [errorResiduos, setErrorResiduos] = useState<string | null>(null);

  useEffect(() => {
    const cargarResiduos = async () => {
      setLoadingResiduos(true);
      setErrorResiduos(null);
      try {
        const data = await ResiduoService.listar({ estado: 'activo' });
        setTiposResiduos(data);
      } catch (e) {
        const err = e as Error;
        setErrorResiduos(err.message || 'Error cargando tipos de residuos');
      } finally {
        setLoadingResiduos(false);
      }
    };
    cargarResiduos();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);
    try {
      await SolicitudService.crear({
        usuario_id: user.id,
        descripcion: formData.observaciones || `Recolección de residuo tipo ${formData.tipoResiduo}`,
        tipo_residuo: parseInt(formData.tipoResiduo, 10)
      });
      setSubmitSuccess('Solicitud registrada correctamente');
      setFormData({
        direccion: '', tipoResiduo: '', cantidadEstimada: '', fechaPreferida: '', horaPreferida: '', observaciones: ''
      });
    } catch (err) {
      const error = err as Error;
      setSubmitError(error.message || 'Error al registrar la solicitud');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <UsuarioGuard>
      <RoleBasedLayout>
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Solicitar Recolección</h1>
            <p className="mt-2 text-gray-600">
              Programa una recolección de materiales reciclables en tu domicilio
            </p>
          </div>

          <div className="bg-white shadow-sm rounded-lg">
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Mensajes */}
              {submitError && <p className="text-sm text-red-600">{submitError}</p>}
              {submitSuccess && <p className="text-sm text-green-600">{submitSuccess}</p>}

              {/* Dirección */}
              <div>
                <Input
                  type="text"
                  id="direccion"
                  name="direccion"
                  label="Dirección de Recolección *"
                  value={formData.direccion}
                  onChange={handleChange}
                  required
                  placeholder="Ingresa la dirección completa"
                />
              </div>

              {/* Tipo de Residuo */}
              <div>
                <Select
                  id="tipoResiduo"
                  name="tipoResiduo"
                  label="Tipo de Residuo *"
                  value={formData.tipoResiduo}
                  onChange={handleChange}
                  required
                  placeholder="Selecciona el tipo de residuo"
                  options={tiposResiduos.map(tipo => ({
                    value: String(tipo.id),
                    label: tipo.nombre
                  }))}
                />
                {loadingResiduos && <p className="text-xs text-gray-500 mt-1">Cargando tipos de residuos...</p>}
                {errorResiduos && <p className="text-xs text-red-600 mt-1">{errorResiduos}</p>}
              </div>

              {/* Cantidad Estimada */}
              <div>
                <Input
                  type="number"
                  id="cantidadEstimada"
                  name="cantidadEstimada"
                  label="Cantidad Estimada (kg)"
                  value={formData.cantidadEstimada}
                  onChange={handleChange}
                  min="1"
                  step="0.1"
                  placeholder="Ej: 5.5"
                />
              </div>

              {/* Fecha y Hora Preferida */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Input
                    type="date"
                    id="fechaPreferida"
                    name="fechaPreferida"
                    label="Fecha Preferida *"
                    value={formData.fechaPreferida}
                    onChange={handleChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div>
                  <Select
                    id="horaPreferida"
                    name="horaPreferida"
                    label="Hora Preferida"
                    value={formData.horaPreferida}
                    onChange={handleChange}
                    placeholder="Selecciona una hora"
                    options={[
                      { value: '08:00-10:00', label: '8:00 AM - 10:00 AM' },
                      { value: '10:00-12:00', label: '10:00 AM - 12:00 PM' },
                      { value: '14:00-16:00', label: '2:00 PM - 4:00 PM' },
                      { value: '16:00-18:00', label: '4:00 PM - 6:00 PM' },
                    ]}
                  />
                </div>
              </div>

              {/* Observaciones */}
              <div>
                <Textarea
                  id="observaciones"
                  name="observaciones"
                  label="Observaciones"
                  value={formData.observaciones}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Información adicional sobre la recolección..."
                />
              </div>

              {/* Botones */}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting || !formData.tipoResiduo}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  {submitting ? 'Enviando...' : 'Solicitar Recolección'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </RoleBasedLayout>
    </UsuarioGuard>
  );
};

export default SolicitarRecoleccionPage;
