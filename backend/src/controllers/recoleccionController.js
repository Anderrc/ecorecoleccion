const db = require('../config/db');

// Crear recolección
exports.crearRecoleccion = (req, res) => {
  const { nombre, fecha, residuo_id, empresa_id, ruta_id, usuario_id } = req.body;
  if (!nombre || !fecha || !residuo_id || !usuario_id) {
    return res.status(400).json({ error: 'nombre, fecha, residuo_id y usuario_id son obligatorios' });
  }
  const recolectorAuthId = req.user.id; // quien registra

  // Helper to finally insert once we have a valid empresaId
  const doInsert = (empresaIdFinal) => {
    // Validar ruta si viene
    const proceedInsert = (rutaIdFinal) => {
      // validar usuario destino
      db.query('SELECT ID_User FROM Usuarios WHERE ID_User = ? LIMIT 1', [usuario_id], (uErr, uRows) => {
        if (uErr) {
          console.error('Error validando usuario destino:', uErr);
          return res.status(500).json({ error: 'Error validando usuario destino' });
        }
        if (!uRows.length) return res.status(404).json({ error: 'usuario_id no existe' });
      const sqlWithRuta = `INSERT INTO Recolecciones (Nombre, Fecha_Recol, ID_User, ID_Residuos, ID_EMP_REC, ruta_id) VALUES (?,?,?,?,?,?)`;
      const sqlWithoutRuta = `INSERT INTO Recolecciones (Nombre, Fecha_Recol, ID_User, ID_Residuos, ID_EMP_REC) VALUES (?,?,?,?,?)`;
      const paramsWithRuta = [nombre, fecha, usuario_id, residuo_id, empresaIdFinal, rutaIdFinal || null];
      const attemptInsert = () => {
        db.query(sqlWithRuta, paramsWithRuta, (err, result) => {
          if (err) {
            // Si la columna ruta_id aún no existe (falta migración), intentar sin ella
            if (err.code === 'ER_BAD_FIELD_ERROR' && /ruta_id/i.test(err.sqlMessage || '')) {
              console.warn('[Recolecciones] Columna ruta_id no existe aún. Reintentando inserción sin la columna. Aplique la migración SQL recomendada.');
              db.query(sqlWithoutRuta, [nombre, fecha, usuario_id, residuo_id, empresaIdFinal], (err2, result2) => {
                if (err2) {
                  console.error('Error insertando Recoleccion (fallback sin ruta_id):', err2);
                  return res.status(500).json({ error: 'Error al crear recolección (fallback)' });
                }
                return res.status(201).json({ message: 'Recolección creada (sin ruta asociada - migración pendiente)', id: result2.insertId });
              });
              return;
            }
            console.error('Error insertando Recoleccion:', err);
            return res.status(500).json({ error: 'Error al crear recolección' });
          }
          res.status(201).json({ message: 'Recolección creada', id: result.insertId });
        });
      };
      attemptInsert();
      });
    };
    if (ruta_id) {
      db.query('SELECT id, estado, recolector_id FROM rutas WHERE id = ? LIMIT 1', [ruta_id], (rErr, rRows) => {
        if (rErr) {
          console.error('Error validando ruta:', rErr);
          return res.status(500).json({ error: 'Error validando ruta' });
        }
        if (!rRows.length) return res.status(400).json({ error: 'ruta_id no existe' });
        // Validar que ruta no esté completada
        if (rRows[0].estado === 'completada') return res.status(400).json({ error: 'Ruta completada' });
        // Si usuario es recolector y la ruta tiene recolector asignado distinto
        if (req.user.rol === 2 && rRows[0].recolector_id && rRows[0].recolector_id !== recolectorAuthId) {
          return res.status(403).json({ error: 'No puedes asociar esta ruta' });
        }
        proceedInsert(ruta_id);
      });
    } else {
      proceedInsert(null);
    }
  };

  // Si se envía empresa_id validar que exista
  if (empresa_id) {
    db.query('SELECT ID_EMP_REC FROM EMP_REC WHERE ID_EMP_REC = ? LIMIT 1', [empresa_id], (err, rows) => {
      if (err) {
        console.error('Error validando empresa:', err);
        return res.status(500).json({ error: 'Error validando empresa' });
      }
      if (!rows.length) {
        return res.status(400).json({ error: 'empresa_id no existe' });
      }
      doInsert(empresa_id);
    });
    return; // salimos aquí
  }

  // No se envió empresa_id: buscar una empresa existente o crear una por defecto
  db.query('SELECT ID_EMP_REC FROM EMP_REC ORDER BY ID_EMP_REC ASC LIMIT 1', (err, rows) => {
    if (err) {
      console.error('Error buscando empresa existente:', err);
      return res.status(500).json({ error: 'Error resolviendo empresa' });
    }
    if (rows.length) {
      return doInsert(rows[0].ID_EMP_REC);
    }
    // Crear empresa default
    db.query('INSERT INTO EMP_REC (Nombre, Tipo_recoleccion) VALUES (?,?)', ['Empresa Genérica', 'General'], (cErr, result) => {
      if (cErr) {
        console.error('Error creando empresa por defecto:', cErr);
        return res.status(500).json({ error: 'No se pudo crear empresa por defecto' });
      }
      doInsert(result.insertId);
    });
  });
};

// Asignar o cambiar ruta
exports.asignarRuta = (req, res) => {
  const { id } = req.params;
  const { ruta_id } = req.body;
  if (!ruta_id) return res.status(400).json({ error: 'ruta_id requerido' });
  db.query('SELECT ID_User FROM Recolecciones WHERE ID_Recol = ?', [id], (err, recRows) => {
    if (err) return res.status(500).json({ error: 'Error obteniendo recolección' });
    if (!recRows.length) return res.status(404).json({ error: 'Recolección no encontrada' });
    db.query('SELECT id, estado, recolector_id FROM rutas WHERE id = ?', [ruta_id], (rErr, rRows) => {
      if (rErr) return res.status(500).json({ error: 'Error validando ruta' });
      if (!rRows.length) return res.status(404).json({ error: 'Ruta no encontrada' });
      if (rRows[0].estado === 'completada') return res.status(400).json({ error: 'Ruta completada' });
      if (req.user.rol === 2 && rRows[0].recolector_id && rRows[0].recolector_id !== req.user.id) {
        return res.status(403).json({ error: 'No autorizado para esa ruta' });
      }
      db.query('UPDATE Recolecciones SET ruta_id = ? WHERE ID_Recol = ?', [ruta_id, id], (uErr) => {
        if (uErr) return res.status(500).json({ error: 'Error asignando ruta' });
        res.json({ message: 'Ruta asignada', ruta_id });
      });
    });
  });
};

// Listar recolecciones (admin: todas; recolector/usuario: solo propias)
exports.listarRecolecciones = (req, res) => {
  const rol = req.user.rol; // 1 admin
  const userId = req.user.id;
  const { estado } = req.query;
  const filters = [];
  const params = [];
  if (estado) { filters.push('r.estado = ?'); params.push(estado); }
  if (rol !== 1) { filters.push('r.ID_User = ?'); params.push(userId); }
  const where = filters.length ? 'WHERE ' + filters.join(' AND ') : '';
  // Incluir datos de usuario, ruta y empresa con fallbacks si las columnas no existen
  const baseSelect = `SELECT r.ID_Recol id, r.Nombre as nombre, r.Fecha_Recol as fecha, r.estado, 
                      res.nombre as residuo, res.id as residuo_id,
                      u.Nombre as usuario_nombre, u.Apellidos as usuario_apellidos, u.User_name as usuario_username`;
  const selectWithRuta = `${baseSelect}, r.ruta_id, rt.nombre as ruta_nombre`;
  const selectWithoutRuta = `${baseSelect}, NULL as ruta_id, NULL as ruta_nombre`;
  
  const fromWithRuta = `FROM Recolecciones r 
                        JOIN residuos res ON res.id = r.ID_Residuos
                        JOIN Usuarios u ON u.ID_User = r.ID_User
                        LEFT JOIN rutas rt ON rt.id = r.ruta_id`;
  const fromWithoutRuta = `FROM Recolecciones r 
                           JOIN residuos res ON res.id = r.ID_Residuos
                           JOIN Usuarios u ON u.ID_User = r.ID_User`;
  
  const order = `ORDER BY r.ID_Recol DESC`;
  const sqlWithRuta = `${selectWithRuta} ${fromWithRuta} ${where} ${order}`;
  const sqlWithoutRuta = `${selectWithoutRuta} ${fromWithoutRuta} ${where} ${order}`;
  
  db.query(sqlWithRuta, params, (err, rows) => {
    if (err && err.code === 'ER_BAD_FIELD_ERROR' && err.sqlMessage && err.sqlMessage.includes('ruta_id')) {
      // Reintentar sin ruta_id (migración pendiente)
      return db.query(sqlWithoutRuta, params, (err2, rows2) => {
        if (err2) return res.status(500).json({ error: 'Error al listar recolecciones' });
        return res.json({ data: rows2 });
      });
    }
    if (err) return res.status(500).json({ error: 'Error al listar recolecciones' });
    res.json({ data: rows });
  });
};

// Obtener detalle
exports.obtenerRecoleccion = (req,res) => {
  db.query(`SELECT r.*, res.nombre AS residuo_nombre FROM Recolecciones r JOIN residuos res ON res.id = r.ID_Residuos WHERE r.ID_Recol = ?`, [req.params.id], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Error al obtener recolección' });
    if (!rows.length) return res.status(404).json({ error: 'No encontrada' });
    // Si no es admin y no es dueño
    if (req.user.rol !== 1 && rows[0].ID_User !== req.user.id) {
      return res.status(403).json({ error: 'No autorizado' });
    }
    res.json(rows[0]);
  });
};

// Actualizar estado
exports.actualizarEstado = (req,res) => {
  const { estado } = req.body;
  const valid = ['pendiente','en_proceso','completada'];
  if (!valid.includes(estado)) return res.status(400).json({ error: 'Estado inválido' });
  // Verificar propiedad o admin
  db.query('SELECT ID_User FROM Recolecciones WHERE ID_Recol = ?', [req.params.id], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Error interno' });
    if (!rows.length) return res.status(404).json({ error: 'No encontrada' });
    if (req.user.rol !== 1 && rows[0].ID_User !== req.user.id) {
      return res.status(403).json({ error: 'No autorizado' });
    }
    db.query('UPDATE Recolecciones SET estado = ? WHERE ID_Recol = ?', [estado, req.params.id], (uErr) => {
      if (uErr) return res.status(500).json({ error: 'Error al actualizar estado' });
      res.json({ message: 'Estado actualizado' });
    });
  });
};
