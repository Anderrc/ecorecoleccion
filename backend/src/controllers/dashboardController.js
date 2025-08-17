const db = require('../config/db');
const dayjs = require('dayjs');

// Obtener estadísticas globales del dashboard
exports.obtenerEstadisticasDashboard = async (req, res) => {
  try {
    const hoy = dayjs().format('YYYY-MM-DD');

    const queries = {
      usuarios: `SELECT COUNT(*) total, 
                        SUM(CASE WHEN Rol_ID = 1 THEN 1 ELSE 0 END) admins,
                        SUM(CASE WHEN Rol_ID = 2 THEN 1 ELSE 0 END) recolectores,
                        SUM(CASE WHEN Rol_ID = 3 THEN 1 ELSE 0 END) usuarios
                 FROM Usuarios`,
      residuos: `SELECT COUNT(*) total,
                        SUM(CASE WHEN estado = 'activo' THEN 1 ELSE 0 END) activos,
                        SUM(CASE WHEN estado = 'inactivo' THEN 1 ELSE 0 END) inactivos,
                        COUNT(DISTINCT categoria) categorias
                 FROM residuos`,
      recolecciones: `SELECT COUNT(*) total,
                             SUM(CASE WHEN Fecha_Recol = ? THEN 1 ELSE 0 END) hoy,
                             SUM(CASE WHEN estado = 'pendiente' THEN 1 ELSE 0 END) pendientes,
                             SUM(CASE WHEN estado = 'en_proceso' THEN 1 ELSE 0 END) en_proceso,
                             SUM(CASE WHEN estado = 'completada' THEN 1 ELSE 0 END) completadas
                      FROM Recolecciones`,
      solicitudes: `SELECT COUNT(*) total,
                           SUM(CASE WHEN estado = 'pendiente' THEN 1 ELSE 0 END) pendientes,
                           SUM(CASE WHEN estado = 'aprobada' THEN 1 ELSE 0 END) aprobadas,
                           SUM(CASE WHEN estado = 'rechazada' THEN 1 ELSE 0 END) rechazadas
                    FROM solicitudes`
    };

    const runQuery = (sql, params = []) => new Promise((resolve, reject) => {
      db.query(sql, params, (err, results) => {
        if (err) return reject(err);
        resolve(results[0]);
      });
    });

    const [usuarios, residuos, recolecciones, solicitudes] = await Promise.all([
      runQuery(queries.usuarios),
      runQuery(queries.residuos),
      runQuery(queries.recolecciones, [hoy]),
      runQuery(queries.solicitudes)
    ]);

    res.json({
      usuarios,
      residuos,
      recolecciones,
      solicitudes,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error obteniendo estadísticas del dashboard:', error);
    res.status(500).json({ error: 'Error al obtener estadísticas del dashboard' });
  }
};

// Estadísticas específicas para un usuario autenticado
exports.obtenerEstadisticasPersonales = async (req, res) => {
  try {
    const userId = req.user?.id; // Requiere authMiddleware
    if (!userId) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    const queries = {
      solicitudes: `SELECT 
          COUNT(*) total,
          SUM(CASE WHEN estado = 'pendiente' THEN 1 ELSE 0 END) pendientes
        FROM solicitudes WHERE usuario_id = ?`,
      recolecciones: `SELECT COUNT(*) total
        FROM Recolecciones WHERE ID_User = ?`
    };

    const runQuery = (sql, params = []) => new Promise((resolve, reject) => {
      db.query(sql, params, (err, results) => {
        if (err) return reject(err);
        resolve(results[0]);
      });
    });

    const [solicitudes, recolecciones] = await Promise.all([
      runQuery(queries.solicitudes, [userId]),
      runQuery(queries.recolecciones, [userId])
    ]);

    res.json({
      solicitudes,
      recolecciones,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error obteniendo estadísticas personales:', error);
    res.status(500).json({ error: 'Error al obtener estadísticas personales' });
  }
};
