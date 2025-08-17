'use client';

import React, { useState, useEffect } from 'react';
import { RoleBasedLayout } from '@/components/layouts/RoleBasedLayout';
import { AdminGuard } from '@/components/guards/RoleGuard';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import TipoResiduoModal from '@/components/modals/TipoResiduoModal';
import { 
  ResiduoService, 
  Residuo, 
  CreateResiduoRequest
} from '@/services/residuoService';

const TiposResiduosPage = () => {
  const [tiposResiduos, setTiposResiduos] = useState<Residuo[]>([]);
  const [categorias, setCategorias] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTipo, setSelectedTipo] = useState<Residuo | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [tipoToDelete, setTipoToDelete] = useState<Residuo | null>(null);

  // Cargar datos al montar el componente
  useEffect(() => {
    const loadTiposResiduos = async () => {
      try {
        setLoading(true);
        const data = await ResiduoService.listar();
        setTiposResiduos(data);
      } catch (error) {
        console.error('Error al cargar tipos de residuos:', error);
      } finally {
        setLoading(false);
      }
    };

    const loadCategorias = async () => {
      try {
        const data = await ResiduoService.obtenerCategorias();
        setCategorias(data);
      } catch (error) {
        console.error('Error al cargar categorías:', error);
      }
    };

    const loadData = async () => {
      await loadTiposResiduos();
      await loadCategorias();
    };
    
    loadData();
  }, []);

  const loadTiposResiduos = async () => {
    try {
      setLoading(true);
      const data = await ResiduoService.listar({ buscar: searchTerm });
      setTiposResiduos(data);
    } catch (error) {
      console.error('Error al cargar tipos de residuos:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategorias = async () => {
    try {
      const data = await ResiduoService.obtenerCategorias();
      setCategorias(data);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    }
  };

  // Recargar cuando cambie el término de búsqueda
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      const loadTiposResiduos = async () => {
        try {
          setLoading(true);
          const data = await ResiduoService.listar({ buscar: searchTerm });
          setTiposResiduos(data);
        } catch (error) {
          console.error('Error al cargar tipos de residuos:', error);
        } finally {
          setLoading(false);
        }
      };
      
      loadTiposResiduos();
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [searchTerm]);

  const filteredTipos = tiposResiduos.filter(tipo =>
    tipo.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (tipo.categoria && tipo.categoria.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleCreate = async (data: CreateResiduoRequest) => {
    try {
      await ResiduoService.crear(data);
      await loadTiposResiduos();
      await loadCategorias();
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Error al crear tipo de residuo:', error);
      throw error;
    }
  };

  const handleEdit = (tipo: Residuo) => {
    setSelectedTipo(tipo);
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (data: CreateResiduoRequest) => {
    if (!selectedTipo) return;
    
    try {
      await ResiduoService.actualizar(selectedTipo.id, data);
      await loadTiposResiduos();
      await loadCategorias();
      setIsEditModalOpen(false);
      setSelectedTipo(null);
    } catch (error) {
      console.error('Error al actualizar tipo de residuo:', error);
      throw error;
    }
  };

  const handleDeleteConfirm = (tipo: Residuo) => {
    setTipoToDelete(tipo);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!tipoToDelete) return;

    try {
      await ResiduoService.eliminar(tipoToDelete.id);
      await loadTiposResiduos();
      setShowDeleteModal(false);
      setTipoToDelete(null);
    } catch (error) {
      console.error('Error al eliminar tipo de residuo:', error);
    }
  };

  const handleToggleStatus = async (tipo: Residuo) => {
    try {
      const nuevoEstado = tipo.estado === 'activo' ? 'inactivo' : 'activo';
      await ResiduoService.actualizar(tipo.id, { estado: nuevoEstado });
      await loadTiposResiduos();
    } catch (error) {
      console.error('Error al cambiar estado:', error);
    }
  };

  return (
    <AdminGuard>
      <RoleBasedLayout>
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Tipos de Residuos</h1>
            <p className="text-gray-600">Administra los tipos de residuos y su puntaje</p>
          </div>

          {/* Controles superiores */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between">
            <div className="flex-1 max-w-md">
              <Input
                type="text"
                placeholder="Buscar tipos de residuos..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              + Nuevo Tipo de Residuo
            </Button>
          </div>

          {/* Tabla de tipos de residuos */}
          <Card className="p-0 overflow-hidden">
            {loading ? (
              <div className="p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                <p className="mt-4 text-gray-600">Cargando tipos de residuos...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tipo de Residuo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Categoría
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Puntaje Base
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
                    {filteredTipos.map((tipo) => (
                      <tr key={tipo.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{tipo.nombre}</div>
                            <div className="text-sm text-gray-500">{tipo.descripcion}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                            {tipo.categoria}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {tipo.puntaje_base} puntos
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            tipo.estado === 'activo' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {tipo.estado}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button
                            onClick={() => handleEdit(tipo)}
                            className="text-indigo-600 hover:text-indigo-900 transition-colors"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleToggleStatus(tipo)}
                            className={`transition-colors ${
                              tipo.estado === 'activo' 
                                ? 'text-red-600 hover:text-red-900' 
                                : 'text-green-600 hover:text-green-900'
                            }`}
                          >
                            {tipo.estado === 'activo' ? 'Desactivar' : 'Activar'}
                          </button>
                          <button
                            onClick={() => handleDeleteConfirm(tipo)}
                            className="text-red-600 hover:text-red-900 transition-colors"
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

          {filteredTipos.length === 0 && !loading && (
            <div className="text-center py-8">
              <p className="text-gray-500">
                {searchTerm ? 'No se encontraron tipos de residuos que coincidan con la búsqueda' : 'No hay tipos de residuos registrados'}
              </p>
            </div>
          )}

          {/* Modal para crear tipo de residuo */}
          <TipoResiduoModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            onSubmit={handleCreate}
            categorias={categorias}
          />

          {/* Modal para editar tipo de residuo */}
          <TipoResiduoModal
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedTipo(null);
            }}
            onSubmit={handleUpdate}
            tipo={selectedTipo}
            categorias={categorias}
          />

          {/* Modal de confirmación para eliminar */}
          <Modal
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            title="Confirmar eliminación"
            message={`¿Está seguro de que desea eliminar el tipo de residuo "${tipoToDelete?.nombre}"? Esta acción no se puede deshacer.`}
            type="error"
            primaryButtonText="Eliminar"
            onPrimaryAction={handleDelete}
            showSecondaryButton
            secondaryButtonText="Cancelar"
          />
        </div>
      </RoleBasedLayout>
    </AdminGuard>
  );
};

export default TiposResiduosPage;
