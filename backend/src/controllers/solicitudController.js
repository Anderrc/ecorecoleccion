const db = require('../config/db');

exports.crearSolicitud = (req, res) => {
  const { usuario_id, descripcion, tipo_residuo, direccion, lat, lng } = req.body;
  if (!usuario_id || !tipo_residuo || !descripcion) {
    return res.status(400).json({ error: 'usuario_id, tipo_residuo y descripcion son obligatorios' });
  }

  const insertWithLocation = `INSERT INTO solicitudes (usuario_id, descripcion, tipo_residuo, direccion, lat, lng) VALUES (?,?,?,?,?,?)`;
  const insertBasic = `INSERT INTO solicitudes (usuario_id, descripcion, tipo_residuo) VALUES (?,?,?)`;

  const attemptInsert = () => {
    db.query(insertWithLocation, [usuario_id, descripcion, tipo_residuo, direccion || null, lat || null, lng || null], (err, result) => {
      if (err) {
        // Fallback si columnas direccion/lat/lng no existen todavía
        if (err.code === 'ER_BAD_FIELD_ERROR') {
          db.query(insertBasic, [usuario_id, descripcion, tipo_residuo], (e2, r2) => {
            if (e2) {
              console.error('Error creando solicitud (fallback):', e2);
              return res.status(500).json({ error: 'Error al crear la solicitud' });
            }
            postInsert(r2.insertId, null);
          });
          return;
        }
        console.error('Error creando solicitud:', err);
        return res.status(500).json({ error: 'Error al crear la solicitud' });
      }
      postInsert(result.insertId, direccion || descripcion.substring(0,150));
    });
  };

  // Después de crear la solicitud, intentar crear o reutilizar ruta "Solicitudes Pendientes" y añadir punto
  const postInsert = (solicitudId, direccionFinal) => {
    // Buscar ruta especial
    db.query('SELECT id FROM rutas WHERE nombre = ? LIMIT 1', ['Solicitudes Pendientes'], (rErr, rRows) => {
      const createPoint = (rutaId) => {
        // Obtener siguiente orden
        db.query('SELECT COALESCE(MAX(orden),0)+1 as nextOrden FROM rutas_puntos WHERE ruta_id = ?', [rutaId], (oErr, oRows) => {
          const nextOrden = oRows && oRows.length ? oRows[0].nextOrden : 1;
          const insertPuntoWithSolicitud = 'INSERT INTO rutas_puntos (ruta_id, direccion, lat, lng, estado, orden, solicitud_id) VALUES (?,?,?,?,?,?,?)';
          const insertPuntoBasic = 'INSERT INTO rutas_puntos (ruta_id, direccion, lat, lng, estado, orden) VALUES (?,?,?,?,?,?)';
          const paramsWith = [rutaId, direccionFinal || 'Dirección no especificada', lat || null, lng || null, 'pendiente', nextOrden, solicitudId];
          const paramsBasic = [rutaId, direccionFinal || 'Dirección no especificada', lat || null, lng || null, 'pendiente', nextOrden];
          db.query(insertPuntoWithSolicitud, paramsWith, (pErr) => {
            if (pErr) {
              if (pErr.code === 'ER_BAD_FIELD_ERROR') {
                // Columna solicitud_id aún no existe: intentar básico
                return db.query(insertPuntoBasic, paramsBasic, (pbErr) => {
                  if (pbErr) console.error('Error insertando punto (fallback):', pbErr);
                  return res.json({ message: 'Solicitud creada con éxito (punto agregado sin vínculo explícito)', id: solicitudId });
                });
              }
              console.error('Error insertando punto de ruta para solicitud:', pErr);
              return res.json({ message: 'Solicitud creada (sin punto en ruta por error interno)', id: solicitudId });
            }
            return res.json({ message: 'Solicitud creada con éxito', id: solicitudId });
          });
        });
      };
      if (rErr) {
        console.error('Error buscando ruta especial:', rErr);
        return res.json({ message: 'Solicitud creada (no se pudo asociar a ruta)', id: solicitudId });
      }
      if (rRows.length) {
        return createPoint(rRows[0].id);
      }
      // Crear ruta especial
      db.query('INSERT INTO rutas (nombre, descripcion, estado) VALUES (?,?,?)', ['Solicitudes Pendientes', 'Ruta automática de solicitudes nuevas', 'asignada'], (cErr, cRes) => {
        if (cErr) {
          console.error('Error creando ruta especial:', cErr);
          return res.json({ message: 'Solicitud creada (ruta pendiente de crear)', id: solicitudId });
        }
        createPoint(cRes.insertId);
      });
    });
  };

  attemptInsert();
};