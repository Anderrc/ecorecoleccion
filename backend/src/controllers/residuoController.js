const db = require('../config/db');

// Obtener todos los tipos de residuos (usando tabla residuos)
exports.obtenerResiduos = (req, res) => {
  const { categoria, estado, buscar } = req.query;
  
  let query = 'SELECT * FROM residuos WHERE 1=1';
  const params = [];

  if (categoria) {
    query += ' AND categoria = ?';
    params.push(categoria);
  }

  if (estado) {
    query += ' AND estado = ?';
    params.push(estado);
  }

  if (buscar) {
    query += ' AND (nombre LIKE ? OR descripcion LIKE ?)';
    params.push(`%${buscar}%`, `%${buscar}%`);
  }

  query += ' ORDER BY categoria, nombre';

  db.query(query, params, (err, results) => {
    if (err) {
      console.error('Error al obtener tipos de residuos:', err);
      return res.status(500).json({ error: 'Error al obtener tipos de residuos' });
    }
    res.json(results);
  });
};

// Obtener un tipo de residuo por ID
exports.obtenerResiduoPorId = (req, res) => {
  const { id } = req.params;

  db.query('SELECT * FROM residuos WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error('Error al obtener tipo de residuo:', err);
      return res.status(500).json({ error: 'Error al obtener tipo de residuo' });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ error: 'Tipo de residuo no encontrado' });
    }

    res.json(results[0]);
  });
};

// Crear un nuevo tipo de residuo
exports.crearResiduo = (req, res) => {
  const { nombre, descripcion, puntaje_base, categoria, estado } = req.body;

  // Validaciones básicas
  if (!nombre || !categoria) {
    return res.status(400).json({ error: 'Nombre y categoría son obligatorios' });
  }

  const query = `
    INSERT INTO residuos (nombre, descripcion, puntaje_base, categoria, estado)
    VALUES (?, ?, ?, ?, ?)
  `;

  const params = [
    nombre,
    descripcion || null,
    puntaje_base || 0.00,
    categoria,
    estado || 'activo'
  ];

  db.query(query, params, (err, result) => {
    if (err) {
      console.error('Error al crear tipo de residuo:', err);
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ error: 'Ya existe un tipo de residuo con ese nombre' });
      }
      return res.status(500).json({ error: 'Error al crear tipo de residuo' });
    }

    res.status(201).json({ 
      message: 'Tipo de residuo creado con éxito',
      id: result.insertId
    });
  });
};

// Actualizar un tipo de residuo
exports.actualizarResiduo = (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, puntaje_base, categoria, estado } = req.body;

  // Verificar que el tipo de residuo existe
  db.query('SELECT id FROM residuos WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error('Error al verificar tipo de residuo:', err);
      return res.status(500).json({ error: 'Error al verificar tipo de residuo' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Tipo de residuo no encontrado' });
    }

    const query = `
      UPDATE residuos 
      SET nombre = ?, descripcion = ?, puntaje_base = ?, categoria = ?, estado = ?
      WHERE id = ?
    `;

    const params = [nombre, descripcion, puntaje_base, categoria, estado, id];

    db.query(query, params, (err, result) => {
      if (err) {
        console.error('Error al actualizar tipo de residuo:', err);
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ error: 'Ya existe un tipo de residuo con ese nombre' });
        }
        return res.status(500).json({ error: 'Error al actualizar tipo de residuo' });
      }

      res.json({ message: 'Tipo de residuo actualizado con éxito' });
    });
  });
};

// Eliminar un tipo de residuo
exports.eliminarResiduo = (req, res) => {
  const { id } = req.params;

  // Verificar que el tipo de residuo existe
  db.query('SELECT id FROM residuos WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error('Error al verificar tipo de residuo:', err);
      return res.status(500).json({ error: 'Error al verificar tipo de residuo' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Tipo de residuo no encontrado' });
    }

    // Verificar si hay criterios asociados
    db.query('SELECT COUNT(*) as count FROM residuos_criterios WHERE tipo_residuo_id = ?', [id], (err, countResult) => {
      if (err) {
        console.error('Error al verificar referencias:', err);
        return res.status(500).json({ error: 'Error al verificar referencias' });
      }

      if (countResult[0].count > 0) {
        return res.status(400).json({ 
          error: 'No se puede eliminar el tipo de residuo porque tiene criterios asociados',
          criterios_asociados: countResult[0].count
        });
      }

      // Eliminar el tipo de residuo
      db.query('DELETE FROM residuos WHERE id = ?', [id], (err, result) => {
        if (err) {
          console.error('Error al eliminar tipo de residuo:', err);
          return res.status(500).json({ error: 'Error al eliminar tipo de residuo' });
        }

        res.json({ message: 'Tipo de residuo eliminado con éxito' });
      });
    });
  });
};

// Obtener categorías únicas
exports.obtenerCategorias = (req, res) => {
  const query = 'SELECT DISTINCT categoria FROM residuos WHERE categoria IS NOT NULL ORDER BY categoria';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener categorías:', err);
      return res.status(500).json({ error: 'Error al obtener categorías' });
    }

    const categorias = results.map(row => row.categoria);
    res.json(categorias);
  });
};

// Obtener tipos de residuos con sus criterios asociados
exports.obtenerResiduoConCriterios = (req, res) => {
  const { id } = req.params;

  const query = `
    SELECT 
      tr.*,
      JSON_ARRAYAGG(
        CASE 
          WHEN rc.id IS NOT NULL THEN JSON_OBJECT(
            'criterio_id', cd.id,
            'nombre_criterio', cd.nombre,
            'descripcion_criterio', cd.descripcion,
            'tipo_dato', cd.tipo_dato,
            'opciones_seleccion', cd.opciones_seleccion,
            'valor_por_defecto', rc.valor_por_defecto,
            'multiplicador_puntaje', rc.multiplicador_puntaje,
            'obligatorio', rc.obligatorio,
            'estado_criterio', rc.estado
          )
          ELSE NULL
        END
      ) as criterios
    FROM residuos tr
    LEFT JOIN residuos_criterios rc ON tr.id = rc.tipo_residuo_id AND rc.estado = 'activo'
    LEFT JOIN criterios_directorio cd ON rc.criterio_id = cd.id AND cd.estado = 'activo'
    WHERE tr.id = ?
    GROUP BY tr.id
  `;

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error al obtener tipo de residuo con criterios:', err);
      return res.status(500).json({ error: 'Error al obtener tipo de residuo con criterios' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Tipo de residuo no encontrado' });
    }

    const tipoResiduo = results[0];
    // Filtrar criterios nulos del array
    if (tipoResiduo.criterios) {
      tipoResiduo.criterios = tipoResiduo.criterios.filter(criterio => criterio !== null);
    } else {
      tipoResiduo.criterios = [];
    }

    res.json(tipoResiduo);
  });
};

// Obtener estadísticas de tipos de residuos
exports.obtenerEstadisticasResiduos = (req, res) => {
  const query = `
    SELECT 
      COUNT(*) as total_tipos_residuos,
      COUNT(DISTINCT categoria) as categorias_unicas,
      AVG(puntaje_base) as promedio_puntaje,
      MAX(puntaje_base) as max_puntaje,
      MIN(puntaje_base) as min_puntaje,
      COUNT(CASE WHEN estado = 'activo' THEN 1 END) as activos,
      COUNT(CASE WHEN estado = 'inactivo' THEN 1 END) as inactivos
    FROM residuos
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener estadísticas:', err);
      return res.status(500).json({ error: 'Error al obtener estadísticas' });
    }

    res.json(results[0]);
  });
};
