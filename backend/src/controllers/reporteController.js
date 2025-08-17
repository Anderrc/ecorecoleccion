const db = require('../config/db');

function buildPeriodFilter(period) {
  if (!period) return { clause: '', params: [] };
  let days;
  switch (period) {
    case 'ultimo-mes': days = 30; break;
    case 'ultimos-3-meses': days = 90; break;
    case 'ultimo-ano': days = 365; break;
    default: return { clause: '', params: [] };
  }
  return { clause: ' AND r.Fecha_Recol >= DATE_SUB(CURDATE(), INTERVAL ? DAY)', params: [days] };
}

// GET /api/reportes/mios
exports.obtenerReportesUsuario = (req, res) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: 'No autenticado' });
  const { period, tipo } = req.query;
  const periodFilter = buildPeriodFilter(period);
  const tipoFilter = tipo ? ' AND res.id = ?' : '';
  const params = [userId, ...periodFilter.params];
  if (tipo) params.push(tipo);

  const query = `
    SELECT 
      r.ID_Recol AS id,
      r.Fecha_Recol AS fecha,
      r.Nombre AS nombre_recoleccion,
      res.nombre AS tipoResiduo,
      res.puntaje_base AS puntosObtenidos,
      r.estado,
      emp.Nombre AS empresa,
      res.categoria
    FROM Recolecciones r
    JOIN residuos res ON r.ID_Residuos = res.id
    LEFT JOIN EMP_REC emp ON r.ID_EMP_REC = emp.ID_EMP_REC
    WHERE r.ID_User = ? ${periodFilter.clause} ${tipoFilter}
    ORDER BY r.Fecha_Recol DESC, r.ID_Recol DESC`;

  db.query(query, params, (err, results) => {
    if (err) {
      console.error('Error obteniendo reportes usuario:', err);
      return res.status(500).json({ error: 'Error obteniendo reportes' });
    }
    const mapped = results.map(r => ({
      id: r.id,
      fecha: r.fecha,
      direccion: '',
      tipoResiduo: r.tipoResiduo,
      cantidadKg: null,
      puntosObtenidos: r.puntosObtenidos ?? 0,
      estado: r.estado,
      recolector: r.empresa || 'N/D',
      observaciones: null,
      categoria: r.categoria
    }));
    res.json(mapped);
  });
};

// GET /api/reportes/mios/estadisticas
exports.obtenerEstadisticasUsuario = (req, res) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: 'No autenticado' });
  const { period } = req.query;
  const periodFilter = buildPeriodFilter(period);
  const params = [userId, ...periodFilter.params];

  const query = `
    SELECT 
      COUNT(*) AS total_recolecciones,
      SUM(CASE WHEN r.estado='completada' THEN 1 ELSE 0 END) AS completadas,
      SUM(CASE WHEN r.estado='pendiente' THEN 1 ELSE 0 END) AS pendientes,
      SUM(CASE WHEN r.estado='en_proceso' THEN 1 ELSE 0 END) AS en_proceso,
      SUM(res.puntaje_base) AS total_puntos,
      COUNT(DISTINCT res.categoria) AS categorias
    FROM Recolecciones r
    JOIN residuos res ON r.ID_Residuos = res.id
    WHERE r.ID_User = ? ${periodFilter.clause}`;

  db.query(query, params, (err, results) => {
    if (err) {
      console.error('Error obteniendo estadísticas usuario:', err);
      return res.status(500).json({ error: 'Error obteniendo estadísticas' });
    }
    const row = results[0] || {};
    res.json({
      totalRecolecciones: row.total_recolecciones || 0,
      completadas: row.completadas || 0,
      pendientes: row.pendientes || 0,
      enProceso: row.en_proceso || 0,
      totalPuntos: row.total_puntos || 0,
      categorias: row.categorias || 0,
      totalKg: null
    });
  });
};
