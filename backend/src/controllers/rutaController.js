const db = require('../config/db');

exports.listarRutas = (req, res) => {
  const { buscar } = req.query;
  let sql = `SELECT r.*, u.Nombre as recolector_nombre, u.Apellidos as recolector_apellidos
             FROM rutas r
             LEFT JOIN Usuarios u ON r.recolector_id = u.ID_User
             WHERE 1=1`;
  const params = [];
  if (buscar) {
    sql += ' AND (r.nombre LIKE ? OR r.descripcion LIKE ? OR u.Nombre LIKE ? OR u.Apellidos LIKE ?)';
    params.push(`%${buscar}%`, `%${buscar}%`, `%${buscar}%`, `%${buscar}%`);
  }
  sql += ' ORDER BY r.fecha_asignacion DESC, r.id DESC';
  db.query(sql, params, (err, rutas) => {
    if (err) return res.status(500).json({ error: 'Error listando rutas' });
    if (!rutas.length) return res.json([]);
    const ids = rutas.map(r => r.id);
    db.query('SELECT * FROM rutas_puntos WHERE ruta_id IN (?) ORDER BY orden, id', [ids], (err2, puntos) => {
      if (err2) return res.status(500).json({ error: 'Error obteniendo puntos' });
      const agrupados = rutas.map(r => ({
        id: r.id,
        nombre: r.nombre,
        descripcion: r.descripcion,
        recolector: r.recolector_id ? { id: r.recolector_id, nombre: r.recolector_nombre, apellidos: r.recolector_apellidos } : null,
        fechaAsignacion: r.fecha_asignacion,
        estado: r.estado,
        puntos: puntos.filter(p => p.ruta_id === r.id).map(p => ({
          id: p.id,
          direccion: p.direccion,
          coordenadas: { lat: Number(p.lat), lng: Number(p.lng) },
          estado: p.estado
        }))
      }));
      res.json(agrupados);
    });
  });
};

exports.obtenerRuta = (req, res) => {
  const { id } = req.params;
  db.query(`SELECT r.*, u.Nombre as recolector_nombre, u.Apellidos as recolector_apellidos
             FROM rutas r LEFT JOIN Usuarios u ON r.recolector_id = u.ID_User WHERE r.id = ?`, [id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error obteniendo ruta' });
    if (!results.length) return res.status(404).json({ error: 'Ruta no encontrada' });
    const ruta = results[0];
    db.query('SELECT * FROM rutas_puntos WHERE ruta_id = ? ORDER BY orden, id', [id], (e2, pts) => {
      if (e2) return res.status(500).json({ error: 'Error obteniendo puntos' });
      ruta.puntos = pts.map(p => ({ id: p.id, direccion: p.direccion, coordenadas: { lat: Number(p.lat), lng: Number(p.lng) }, estado: p.estado }));
      res.json({
        id: ruta.id,
        nombre: ruta.nombre,
        descripcion: ruta.descripcion,
        recolector: ruta.recolector_id ? { id: ruta.recolector_id, nombre: ruta.recolector_nombre, apellidos: ruta.recolector_apellidos } : null,
        fechaAsignacion: ruta.fecha_asignacion,
        estado: ruta.estado,
        puntos: ruta.puntos
      });
    });
  });
};

exports.crearRuta = (req, res) => {
  const { nombre, descripcion, recolector_id, puntos } = req.body;
  if (!nombre) return res.status(400).json({ error: 'Nombre requerido' });
  db.query('INSERT INTO rutas (nombre, descripcion, recolector_id) VALUES (?,?,?)', [nombre, descripcion || null, recolector_id || null], (err, result) => {
    if (err) return res.status(500).json({ error: 'Error creando ruta' });
    const rutaId = result.insertId;
    if (Array.isArray(puntos) && puntos.length) {
      const values = puntos.map((p, idx) => [rutaId, p.direccion, p.lat || null, p.lng || null, p.estado || 'pendiente', idx + 1]);
      db.query('INSERT INTO rutas_puntos (ruta_id, direccion, lat, lng, estado, orden) VALUES ?',[values], (e2) => {
        if (e2) return res.status(500).json({ error: 'Error insertando puntos' });
        res.status(201).json({ message: 'Ruta creada', id: rutaId });
      });
    } else {
      res.status(201).json({ message: 'Ruta creada', id: rutaId });
    }
  });
};

exports.actualizarEstadoPunto = (req, res) => {
  const { puntoId } = req.params;
  const { estado } = req.body;
  if (!['pendiente','en_proceso','completado'].includes(estado)) return res.status(400).json({ error: 'Estado inválido' });
  db.query('UPDATE rutas_puntos SET estado = ? WHERE id = ?', [estado, puntoId], (err, result) => {
    if (err) return res.status(500).json({ error: 'Error actualizando punto' });
    if (!result.affectedRows) return res.status(404).json({ error: 'Punto no encontrado' });
    res.json({ message: 'Estado actualizado' });
  });
};

exports.actualizarEstadoRuta = (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;
  if (!['asignada','en_progreso','completada'].includes(estado)) return res.status(400).json({ error: 'Estado inválido' });
  db.query('UPDATE rutas SET estado = ? WHERE id = ?', [estado, id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Error actualizando ruta' });
    if (!result.affectedRows) return res.status(404).json({ error: 'Ruta no encontrada' });
    res.json({ message: 'Estado ruta actualizado' });
  });
};
