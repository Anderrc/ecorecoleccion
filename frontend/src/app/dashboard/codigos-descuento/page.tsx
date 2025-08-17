'use client';

import React, { useState } from 'react';
import { RoleBasedLayout } from '@/components/layouts/RoleBasedLayout';
import { UsuarioGuard } from '@/components/guards/RoleGuard';
import { Button, Card } from '@/components/ui';

interface DiscountCode {
  id: string;
  codigo: string;
  descuento: number;
  puntosRequeridos: number;
  fechaExpiracion: string;
  usado: boolean;
  fechaCreacion: string;
}

const CodigosDescuentoPage = () => {
  const [userPoints] = useState(245); // Simulación de puntos del usuario
  const [generatedCodes, setGeneratedCodes] = useState<DiscountCode[]>([
    {
      id: '1',
      codigo: 'ECO10-ABC123',
      descuento: 10,
      puntosRequeridos: 50,
      fechaExpiracion: '2025-09-17',
      usado: false,
      fechaCreacion: '2025-08-10',
    },
    {
      id: '2',
      codigo: 'ECO15-XYZ789',
      descuento: 15,
      puntosRequeridos: 100,
      fechaExpiracion: '2025-08-25',
      usado: true,
      fechaCreacion: '2025-08-05',
    },
  ]);

  const availableDiscounts = [
    {
      descuento: 5,
      puntosRequeridos: 25,
      descripcion: '5% de descuento en tiendas afiliadas',
    },
    {
      descuento: 10,
      puntosRequeridos: 50,
      descripcion: '10% de descuento en tiendas afiliadas',
    },
    {
      descuento: 15,
      puntosRequeridos: 100,
      descripcion: '15% de descuento en tiendas afiliadas',
    },
    {
      descuento: 20,
      puntosRequeridos: 150,
      descripcion: '20% de descuento en tiendas afiliadas',
    },
    {
      descuento: 25,
      puntosRequeridos: 200,
      descripcion: '25% de descuento en tiendas afiliadas',
    },
  ];

  const generateCode = (descuento: number, puntosRequeridos: number) => {
    if (userPoints < puntosRequeridos) {
      alert('No tienes suficientes puntos para generar este código');
      return;
    }

    const newCode: DiscountCode = {
      id: Date.now().toString(),
      codigo: `ECO${descuento}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      descuento,
      puntosRequeridos,
      fechaExpiracion: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 días
      usado: false,
      fechaCreacion: new Date().toISOString().split('T')[0],
    };

    setGeneratedCodes([newCode, ...generatedCodes]);
    // Aquí se restarían los puntos del usuario
    console.log('Código generado:', newCode);
  };

  const copyToClipboard = (codigo: string) => {
    navigator.clipboard.writeText(codigo);
    alert('Código copiado al portapapeles');
  };

  return (
    <UsuarioGuard>
      <RoleBasedLayout>
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Códigos de Descuento</h1>
            <p className="mt-2 text-gray-600">
              Canjea tus puntos por códigos de descuento para usar en tiendas afiliadas
            </p>
          </div>

          {/* Puntos disponibles */}
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Tus Puntos</h2>
                <p className="text-3xl font-bold text-green-600 mt-2">{userPoints}</p>
                <p className="text-sm text-gray-500">Puntos disponibles</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Códigos generados</p>
                <p className="text-2xl font-bold text-gray-900">{generatedCodes.length}</p>
              </div>
            </div>
          </Card>

          {/* Generar nuevos códigos */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Generar Códigos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableDiscounts.map((discount) => (
                <Card key={discount.descuento} className="p-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {discount.descuento}%
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      {discount.descripcion}
                    </p>
                    <div className="mb-4">
                      <span className="text-lg font-semibold text-gray-900">
                        {discount.puntosRequeridos} puntos
                      </span>
                    </div>
                    <Button
                      onClick={() => generateCode(discount.descuento, discount.puntosRequeridos)}
                      disabled={userPoints < discount.puntosRequeridos}
                      className="w-full"
                    >
                      {userPoints < discount.puntosRequeridos ? 'Puntos insuficientes' : 'Generar Código'}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Códigos generados */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Mis Códigos</h2>
            {generatedCodes.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-gray-500">No has generado códigos de descuento aún</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {generatedCodes.map((code) => (
                  <Card key={code.id} className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4">
                          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                            code.usado 
                              ? 'bg-gray-100 text-gray-600' 
                              : new Date(code.fechaExpiracion) < new Date()
                              ? 'bg-red-100 text-red-600'
                              : 'bg-green-100 text-green-600'
                          }`}>
                            {code.usado 
                              ? 'Usado' 
                              : new Date(code.fechaExpiracion) < new Date()
                              ? 'Expirado'
                              : 'Activo'
                            }
                          </div>
                          <div>
                            <span className="text-2xl font-bold text-green-600">
                              {code.descuento}%
                            </span>
                            <span className="text-sm text-gray-500 ml-2">descuento</span>
                          </div>
                        </div>
                        <div className="mt-2">
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span>Código: <span className="font-mono font-medium">{code.codigo}</span></span>
                            <span>Expira: {new Date(code.fechaExpiracion).toLocaleDateString()}</span>
                            <span>Creado: {new Date(code.fechaCreacion).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => copyToClipboard(code.codigo)}
                          variant="outline"
                          size="sm"
                          disabled={code.usado || new Date(code.fechaExpiracion) < new Date()}
                        >
                          Copiar
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Información adicional */}
          <Card className="p-6 bg-blue-50">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              ¿Cómo usar los códigos?
            </h3>
            <ul className="text-blue-800 space-y-1 text-sm">
              <li>• Los códigos tienen una validez de 30 días desde su generación</li>
              <li>• Puedes usar los códigos en cualquier tienda afiliada</li>
              <li>• Cada código es de un solo uso</li>
              <li>• Los puntos se descuentan al momento de generar el código</li>
            </ul>
          </Card>
        </div>
      </RoleBasedLayout>
    </UsuarioGuard>
  );
};

export default CodigosDescuentoPage;
