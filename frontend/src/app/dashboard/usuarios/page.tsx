"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { RoleBasedLayout } from '@/components/layouts/RoleBasedLayout';
import { RoleGuard } from '@/components/guards/RoleGuard';
import { UserRole, ROLE_NAMES } from '@/types/roles';
import { GestionUsuarioService, UsuarioListado } from '@/services/gestionUsuarioService';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';

const GestionUsuariosPage = () => {
  const [usuarios, setUsuarios] = useState<UsuarioListado[]>([]);
  const [buscar, setBuscar] = useState('');
  const [rolFilter, setRolFilter] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [editOpen, setEditOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);
  const [selected, setSelected] = useState<UsuarioListado | null>(null);
  const [form, setForm] = useState<{nombre:string; apellidos:string; correo:string; user_name:string; rol_id:number; password?:string}>({nombre:'', apellidos:'', correo:'', user_name:'', rol_id:3});

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await GestionUsuarioService.listar({ buscar, rol_id: rolFilter ? parseInt(rolFilter) : undefined, page, pageSize });
      setUsuarios(res.data);
      setTotal(res.pagination.total);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  }, [buscar, rolFilter, page, pageSize]);

  useEffect(() => { load(); }, [load]);
  const totalPages = Math.ceil(total / pageSize) || 1;

  return (
    <RoleGuard allowedRoles={[UserRole.ADMIN]}>
      <RoleBasedLayout>
        <div className="p-6 space-y-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
            <p className="mt-2 text-gray-600">
              Administra todos los usuarios del sistema
            </p>
          </div>

          <div className="bg-white shadow-sm rounded-lg p-6 mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Input label="Buscar" value={buscar} onChange={e => { setPage(1); setBuscar(e.target.value); }} placeholder="Nombre, correo, usuario..." />
            </div>
            <div>
              <Select label="Rol" value={rolFilter} onChange={e => { setPage(1); setRolFilter(e.target.value); }} placeholder="Selecciona rol" options={[
                { value: '', label: 'Todos' },
                { value: '1', label: 'Administrador' },
                { value: '2', label: 'Recolector' },
                { value: '3', label: 'Usuario' }
              ]} />
            </div>
            <div className="flex items-end gap-2">
              <button onClick={() => load()} disabled={loading} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50">Buscar</button>
              <button onClick={() => { setBuscar(''); setRolFilter(''); setPage(1); }} className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200">Limpiar</button>
            </div>
            <div className="flex items-end">
              <span className="text-sm text-gray-500">Total: {total}</span>
            </div>
          </div>

          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Usuario
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contacto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rol
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Puntos
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Registro
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {usuarios.map((usuario) => (
                    <tr key={usuario.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{usuario.nombre} {usuario.apellidos}</div>
                          <div className="text-sm text-gray-500">@{usuario.user_name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{usuario.correo}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">{ROLE_NAMES[usuario.rol_id as unknown as UserRole] || usuario.rol_id}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Activo</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        -
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {usuario.created_at ? new Date(usuario.created_at).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <button
                          onClick={() => {
                            setSelected(usuario);
                            setForm({
                              nombre: usuario.nombre,
                              apellidos: usuario.apellidos,
                              correo: usuario.correo,
                              user_name: usuario.user_name,
                              rol_id: usuario.rol_id
                            });
                            setEditOpen(true);
                          }}
                          className="text-blue-600 hover:text-blue-800"
                        >Editar</button>
                        <button
                          disabled={deleteLoading === usuario.id}
                          onClick={async () => {
                            if (!confirm('¿Eliminar este usuario?')) return;
                            setDeleteLoading(usuario.id);
                            try {
                              await GestionUsuarioService.eliminar(usuario.id);
                              await load();
                            } catch (e) {
                              alert((e as Error).message || 'Error al eliminar');
                            } finally {
                              setDeleteLoading(null);
                            }
                          }}
                          className={`text-red-600 hover:text-red-800 ${deleteLoading===usuario.id? 'opacity-50 cursor-not-allowed':''}`}
                        >{deleteLoading===usuario.id? 'Eliminando...' : 'Eliminar'}</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {loading && <div className="p-6 text-center text-gray-500">Cargando...</div>}
          {error && <div className="p-6 text-center text-red-500">{error}</div>}
          {!loading && usuarios.length === 0 && <div className="p-6 text-center text-gray-500">Sin resultados</div>}

          <div className="flex items-center justify-between pt-4">
            <p className="text-sm text-gray-600">Página {page} de {totalPages} (total {total})</p>
            <div className="space-x-2">
              <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1 || loading} className="px-3 py-1 text-sm border rounded disabled:opacity-50">Anterior</button>
              <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page===totalPages || loading} className="px-3 py-1 text-sm border rounded disabled:opacity-50">Siguiente</button>
            </div>
          </div>
          {editOpen && selected && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
              <div className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Editar Usuario</h2>
            <button onClick={()=> setEditOpen(false)} className="text-gray-500 hover:text-gray-700">✕</button>
          </div>
          <form
            onSubmit={async e => {
              e.preventDefault();
              setEditLoading(true);
              try {
                if(!selected) return; 
                await GestionUsuarioService.actualizar(selected.id, {
                  nombre: form.nombre,
                  apellidos: form.apellidos,
                  correo: form.correo,
                  user_name: form.user_name,
                  rol_id: form.rol_id,
                  password: form.password || undefined
                });
                setEditOpen(false);
                await load();
              } catch (err) {
                alert((err as Error).message || 'Error al actualizar');
              } finally {
                setEditLoading(false);
              }
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Nombre" value={form.nombre} onChange={e=> setForm(f=>({...f, nombre:e.target.value}))} required />
              <Input label="Apellidos" value={form.apellidos} onChange={e=> setForm(f=>({...f, apellidos:e.target.value}))} required />
              <Input label="Correo" type="email" value={form.correo} onChange={e=> setForm(f=>({...f, correo:e.target.value}))} required />
              <Input label="Usuario" value={form.user_name} onChange={e=> setForm(f=>({...f, user_name:e.target.value}))} required />
              <Select label="Rol" value={String(form.rol_id)} onChange={e=> setForm(f=>({...f, rol_id: parseInt(e.target.value)}))} options={[
                { value:'1', label:'Administrador'},
                { value:'2', label:'Recolector'},
                { value:'3', label:'Usuario'}
              ]} />
              <Input label="Nueva Contraseña" type="password" value={form.password || ''} onChange={e=> setForm(f=>({...f, password:e.target.value || undefined}))} placeholder="(opcional)" />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={()=> setEditOpen(false)} className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50">Cancelar</button>
              <button disabled={editLoading} type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50">{editLoading? 'Guardando...' : 'Guardar'}</button>
            </div>
          </form>
              </div>
            </div>
          )}
        </div>
      </RoleBasedLayout>
    </RoleGuard>
  );
};
export default GestionUsuariosPage;
