'use client';

import { useEffect, useState } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { RoleBasedLayout } from '@/components/layouts/RoleBasedLayout';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import { ResiduoService } from '@/services/residuoService';
import { RecoleccionService } from '@/services/recoleccionService';
import { RutaService, Ruta } from '@/services/rutaService';
import { apiClient } from '@/lib/api';
import { usePermissions } from '@/hooks/usePermissions';
import { useAuth } from '@/contexts/AuthContext';

interface Option {
  value: string;
  label: string;
}

const RegistrarRecoleccionPage = () => {
  const { isRecolector, isAdmin, isUsuario } = usePermissions();
  const { user } = useAuth();
  const [nombre, setNombre] = useState('');
  const [fecha, setFecha] = useState<string>(new Date().toISOString().slice(0,10));
  const [residuoId, setResiduoId] = useState('');
  const [rutaId, setRutaId] = useState('');
  const [peso, setPeso] = useState('');
  const [nota, setNota] = useState('');
  const [residuos, setResiduos] = useState<Option[]>([]);
  const [rutas, setRutas] = useState<Option[]>([]);
  const [usuarioIdInput, setUsuarioIdInput] = useState('');
  interface UsuarioBasico { ID_User: number; User_name: string; Nombre: string; Apellidos: string; }
  const [usuarioValidado, setUsuarioValidado] = useState<UsuarioBasico | null>(null);
  const [validandoUsuario, setValidandoUsuario] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(()=> {
    const load = async () => {
      try {
  const r = await ResiduoService.listar();
  setResiduos(r.map(x=>({ value:String(x.id), label:x.nombre })));
        // Rutas solo para recolector o admin
        if (isRecolector() || isAdmin()) {
          const rutasData = await RutaService.listar();
          const rutasArr: Ruta[] = Array.isArray(rutasData) ? rutasData : [];
          setRutas(rutasArr.filter(rt => rt.estado !== 'completada').map(rt=>({
            value:String(rt.id),
            label:`${rt.nombre} (${rt.estado})`
          })));
        }
        // Si es usuario final, autovalidar con su propio user del contexto
        if (isUsuario() && user) {
          setUsuarioValidado({
            ID_User: user.id,
            User_name: user.user_name || user.nombre,
            Nombre: user.nombre,
            Apellidos: user.apellidos || ''
          });
        }
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Error cargando datos';
        setErrorMsg(msg);
      } finally {
        setLoadingData(false);
      }
    };
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e:React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');
    if (!nombre || !fecha || !residuoId || !usuarioValidado) {
      setErrorMsg('Completa los campos obligatorios y valida el usuario');
      return;
    }
    setLoading(true);
    try {
      await RecoleccionService.crear({
        nombre,
        fecha,
        residuo_id: parseInt(residuoId),
        ruta_id: rutaId ? parseInt(rutaId) : undefined,
        usuario_id: (isUsuario() && user) ? user.id : usuarioValidado.ID_User,
        // peso y nota podrían enviarse cuando existan columnas
      });
      setSuccessMsg('Recolección registrada correctamente.');
      setNombre('');
      setResiduoId('');
      setRutaId('');
      setPeso('');
      setNota('');
      setUsuarioIdInput('');
      setUsuarioValidado(null);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Error registrando recolección';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <RoleBasedLayout>
        <div className="max-w-3xl space-y-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Registrar Recolección Realizada</h1>
            <p className="text-sm text-gray-600">
              Este formulario lo usan recolectores (o un administrador) para confirmar una recolección ya ejecutada.
              Diferente de “Solicitar Recolección” (que crea una petición del usuario), aquí se registra lo
              efectivamente recogido y se podrán calcular puntos y validar criterios.
            </p>
            <Card className="mt-4 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm">
              <ul className="list-disc ml-5 space-y-1">
                <li>1. Selecciona el tipo de residuo recogido.</li>
                <li>2. (Opcional) Asocia la ruta en la que ocurrió.</li>
                <li>3. Ingresa nombre o referencia del punto (dirección / identificador).</li>
                <li>4. Guarda para generar el registro operativo.</li>
              </ul>
            </Card>
          </div>

            <Card className="p-6">
              {loadingData ? (
                <p className="text-sm text-gray-500">Cargando datos...</p>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {!isUsuario() && (
                    <div className="space-y-2">
                      <div className="flex gap-3">
                        <Input
                          label="ID Usuario (beneficiario) *"
                          value={usuarioIdInput}
                          onChange={e=>setUsuarioIdInput(e.target.value)}
                          placeholder="Ej: 15"
                          type="number"
                          min={1}
                          required
                        />
                        <div className="flex items-end pb-0.5">
                          <Button
                            type="button"
                            disabled={!usuarioIdInput || validandoUsuario}
                            onClick={async ()=>{
                              setErrorMsg('');
                              setSuccessMsg('');
                              setValidandoUsuario(true);
                              setUsuarioValidado(null);
                              try {
                                const res = await apiClient.get(`/usuarios/basico/${usuarioIdInput}`);
                                setUsuarioValidado(res.data as UsuarioBasico);
                              } catch(e){
                                const msg = e instanceof Error ? e.message : 'Usuario no encontrado';
                                setErrorMsg(msg);
                              } finally {
                                setValidandoUsuario(false);
                              }
                            }}
                          >
                            {validandoUsuario ? 'Validando...' : 'Validar'}
                          </Button>
                        </div>
                      </div>
                      {usuarioValidado && (
                        <Card className="p-3 bg-slate-50 border border-slate-200 text-xs text-slate-700">
                          <p><span className="font-semibold">Usuario:</span> {usuarioValidado.User_name} (ID {usuarioValidado.ID_User})</p>
                          <p><span className="font-semibold">Nombre:</span> {usuarioValidado.Nombre} {usuarioValidado.Apellidos}</p>
                        </Card>
                      )}
                    </div>
                  )}
                  {isUsuario() && usuarioValidado && (
                    <Card className="p-3 bg-slate-50 border border-slate-200 text-xs text-slate-700">
                      <p><span className="font-semibold">Usuario:</span> {usuarioValidado.User_name} (ID {usuarioValidado.ID_User})</p>
                      <p><span className="font-semibold">Nombre:</span> {usuarioValidado.Nombre} {usuarioValidado.Apellidos}</p>
                    </Card>
                  )}
                  <Input
                    label="Nombre / Punto de Recolección *"
                    value={nombre}
                    onChange={e=>setNombre(e.target.value)}
                    placeholder="Ej: Calle 10 #12-30 Apto 201"
                    required
                  />
                  <Select
                    label="Tipo de Residuo *"
                    value={residuoId}
                    onChange={e=>setResiduoId(e.target.value)}
                    placeholder="Selecciona un residuo"
                    options={residuos}
                    required
                  />
                  {(isRecolector() || isAdmin()) && (
                    <Select
                      label="Ruta (opcional)"
                      value={rutaId}
                      onChange={e=>setRutaId(e.target.value)}
                      placeholder="Selecciona una ruta"
                      options={rutas}
                    />
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Fecha *"
                      type="date"
                      value={fecha}
                      onChange={e=>setFecha(e.target.value)}
                      required
                    />
                    <Input
                      label="Peso (kg) (solo informativo)"
                      type="number"
                      step="0.01"
                      value={peso}
                      onChange={e=>setPeso(e.target.value)}
                      placeholder="Ej: 5.40"
                    />
                  </div>
                  <Textarea
                    label="Nota / Observaciones"
                    value={nota}
                    onChange={e=>setNota(e.target.value)}
                    placeholder="Observaciones de la recolección (estado del material, incidencias, etc.)"
                    rows={3}
                  />

                  {errorMsg && <p className="text-sm text-red-600">{errorMsg}</p>}
                  {successMsg && <p className="text-sm text-emerald-600">{successMsg}</p>}

                  <div className="flex gap-3">
                    <Button type="submit" disabled={loading}>
                      {loading ? 'Guardando...' : 'Registrar Recolección'}
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={()=>{
                        setNombre('');
                        setResiduoId('');
                        setRutaId('');
                        setPeso('');
                        setNota('');
                        setErrorMsg('');
                        setSuccessMsg('');
                      }}
                    >
                      Limpiar
                    </Button>
                  </div>
                </form>
              )}
            </Card>
        </div>
      </RoleBasedLayout>
    </ProtectedRoute>
  );
};

export default RegistrarRecoleccionPage;

