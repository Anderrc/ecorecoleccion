"use client";
import React, { useState } from 'react';
import Card from './ui/Card';
import Input from './ui/Input';
import Button from './ui/Button';

interface RegistroRecoleccionData {
  ubicacion: string;
  tipoMaterial: string;
  cantidad: number;
  unidad: string;
  descripcion: string;
  fecha: string;
  hora: string;
}

interface RegistroRecoleccionFormProps {
  onSubmit: (data: RegistroRecoleccionData) => void;
  isLoading?: boolean;
}

const tiposMaterial = [
  { value: 'plastico', label: 'Plástico' },
  { value: 'papel', label: 'Papel y Cartón' },
  { value: 'vidrio', label: 'Vidrio' },
  { value: 'metal', label: 'Metal' },
  { value: 'electronico', label: 'Electrónicos' },
  { value: 'organico', label: 'Orgánico' },
  { value: 'textil', label: 'Textil' },
  { value: 'otro', label: 'Otro' }
];

const unidades = [
  { value: 'kg', label: 'Kilogramos (kg)' },
  { value: 'unidades', label: 'Unidades' },
  { value: 'bolsas', label: 'Bolsas' },
  { value: 'litros', label: 'Litros' }
];

const RegistroRecoleccionForm: React.FC<RegistroRecoleccionFormProps> = ({ 
  onSubmit, 
  isLoading = false 
}) => {
  const [formData, setFormData] = useState<RegistroRecoleccionData>({
    ubicacion: '',
    tipoMaterial: '',
    cantidad: 0,
    unidad: 'kg',
    descripcion: '',
    fecha: new Date().toISOString().split('T')[0],
    hora: new Date().toTimeString().slice(0, 5)
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'cantidad' ? parseFloat(value) || 0 : value 
    }));
    
    // Limpiar error si existe
    if (errors[name]) {
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.ubicacion.trim()) newErrors.ubicacion = 'La ubicación es requerida';
    if (!formData.tipoMaterial) newErrors.tipoMaterial = 'El tipo de material es requerido';
    if (formData.cantidad <= 0) newErrors.cantidad = 'La cantidad debe ser mayor a 0';
    if (!formData.fecha) newErrors.fecha = 'La fecha es requerida';
    if (!formData.hora) newErrors.hora = 'La hora es requerida';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Registro de Recolección</h2>
        <p className="text-gray-600 mt-2">Registra los materiales recolectados</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Ubicación"
            name="ubicacion"
            value={formData.ubicacion}
            onChange={handleChange}
            error={errors.ubicacion}
            placeholder="Ej: Parque Central, Calle 10"
            icon={
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            }
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Material
            </label>
            <select
              name="tipoMaterial"
              value={formData.tipoMaterial}
              onChange={handleChange}
              className={`
                block w-full rounded-lg border px-3 py-2 shadow-sm transition-eco
                focus:border-eco-primary focus:outline-none focus:ring-1 focus:ring-eco-primary
                ${errors.tipoMaterial ? 'border-red-500' : 'border-gray-300'}
              `}
            >
              <option value="">Selecciona un tipo</option>
              {tiposMaterial.map(tipo => (
                <option key={tipo.value} value={tipo.value}>
                  {tipo.label}
                </option>
              ))}
            </select>
            {errors.tipoMaterial && (
              <p className="mt-1 text-sm text-red-600">{errors.tipoMaterial}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Cantidad"
            name="cantidad"
            type="number"
            min="0"
            step="0.1"
            value={formData.cantidad}
            onChange={handleChange}
            error={errors.cantidad}
            placeholder="0"
            icon={
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
              </svg>
            }
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Unidad
            </label>
            <select
              name="unidad"
              value={formData.unidad}
              onChange={handleChange}
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm transition-eco focus:border-eco-primary focus:outline-none focus:ring-1 focus:ring-eco-primary"
            >
              {unidades.map(unidad => (
                <option key={unidad.value} value={unidad.value}>
                  {unidad.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Fecha"
            name="fecha"
            type="date"
            value={formData.fecha}
            onChange={handleChange}
            error={errors.fecha}
          />

          <Input
            label="Hora"
            name="hora"
            type="time"
            value={formData.hora}
            onChange={handleChange}
            error={errors.hora}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción (opcional)
          </label>
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            rows={3}
            placeholder="Agrega detalles adicionales sobre la recolección..."
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm transition-eco focus:border-eco-primary focus:outline-none focus:ring-1 focus:ring-eco-primary resize-none"
          />
        </div>

        <div className="flex space-x-4">
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="flex-1"
            onClick={() => window.history.back()}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            size="lg"
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? 'Registrando...' : 'Registrar Recolección'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default RegistroRecoleccionForm;
