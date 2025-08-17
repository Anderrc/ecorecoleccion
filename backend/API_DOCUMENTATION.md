# API de Gestión de Residuos y Criterios

## Endpoints Disponibles

### 1. API de Residuos (tabla: residuos)
**Base URL:** `/api/residuos`

#### Obtener todos los tipos de residuos
```
GET /api/residuos
Query params opcionales:
- categoria: Filtrar por categoría
- estado: Filtrar por estado (activo/inactivo)
- buscar: Buscar por nombre o descripción
```

#### Obtener tipo de residuo por ID
```
GET /api/residuos/:id
```

#### Obtener tipo de residuo con criterios asociados
```
GET /api/residuos/:id/criterios
```

#### Crear nuevo tipo de residuo (requiere autenticación)
```
POST /api/residuos
Body:
{
  "nombre": "Plástico Biodegradable",
  "descripcion": "Plásticos que se degradan naturalmente",
  "puntaje_base": 25.00,
  "categoria": "Plásticos Eco",
  "estado": "activo"
}
```

#### Actualizar tipo de residuo (requiere autenticación)
```
PUT /api/residuos/:id
Body: (campos a actualizar)
{
  "nombre": "Plástico PET Actualizado",
  "descripcion": "Nueva descripción",
  "puntaje_base": 15.00,
  "categoria": "Plásticos",
  "estado": "activo"
}
```

#### Eliminar tipo de residuo (requiere autenticación)
```
DELETE /api/residuos/:id
```

#### Obtener categorías únicas
```
GET /api/residuos/categorias
```

#### Obtener estadísticas de tipos de residuos
```
GET /api/residuos/estadisticas
```

### 2. API de Criterios (tabla: criterios_directorio)
**Base URL:** `/api/criterios`

#### Obtener todos los criterios
```
GET /api/criterios
Query params opcionales:
- tipo_dato: Filtrar por tipo de dato
- estado: Filtrar por estado
- buscar: Buscar por nombre o descripción
```

#### Obtener criterio por ID
```
GET /api/criterios/:id
```

#### Obtener criterios disponibles para un tipo de residuo
```
GET /api/criterios/disponibles/:tipo_residuo_id
```

#### Crear nuevo criterio (requiere autenticación)
```
POST /api/criterios
Body:
{
  "nombre": "Material Base",
  "descripcion": "Material del que está hecho el residuo",
  "tipo_dato": "seleccion",
  "opciones_seleccion": ["Plástico", "Metal", "Vidrio", "Papel"],
  "obligatorio": true,
  "orden_visualizacion": 8,
  "estado": "activo"
}
```

#### Actualizar criterio (requiere autenticación)
```
PUT /api/criterios/:id
Body: (campos a actualizar)
```

#### Eliminar criterio (requiere autenticación)
```
DELETE /api/criterios/:id
```

#### Asociar criterio a tipo de residuo (requiere autenticación)
```
POST /api/criterios/asociar
Body:
{
  "tipo_residuo_id": 1,
  "criterio_id": 2,
  "valor_por_defecto": "Bueno",
  "multiplicador_puntaje": 1.5,
  "obligatorio": true
}
```

#### Desasociar criterio de tipo de residuo (requiere autenticación)
```
DELETE /api/criterios/desasociar/:tipo_residuo_id/:criterio_id
```

## Tipos de Datos para Criterios

1. **texto**: Campo de texto libre
2. **numero**: Número entero
3. **decimal**: Número decimal
4. **fecha**: Fecha en formato YYYY-MM-DD
5. **booleano**: true/false
6. **seleccion**: Lista de opciones predefinidas (requiere opciones_seleccion)

## Estructura de Base de Datos

### Tablas Principales:
- **residuos**: Tabla principal para gestión de tipos de residuos
- **criterios_directorio**: Catálogo de criterios reutilizables
- **residuos_criterios**: Asociaciones entre tipos de residuos y criterios

### Relaciones:
- `residuos` ←→ `criterios_directorio` (muchos a muchos via `residuos_criterios`)
- Mantenimiento de integridad referencial en todas las operaciones

## Autenticación

Las operaciones de creación, actualización y eliminación requieren autenticación.
Incluir header: `Authorization: Bearer <token>`

## Códigos de Estado HTTP

- **200**: Operación exitosa
- **201**: Recurso creado exitosamente
- **400**: Error en los datos enviados
- **401**: No autenticado
- **404**: Recurso no encontrado
- **500**: Error interno del servidor

## Ejemplos de Respuesta

### Éxito:
```json
{
  "message": "Recurso creado con éxito",
  "id": 123
}
```

### Error:
```json
{
  "error": "Descripción del error"
}
```

### Lista de recursos:
```json
[
  {
    "id": 1,
    "nombre": "Plástico PET",
    "descripcion": "Botellas de plástico",
    "puntaje_base": 10.00,
    "categoria": "Plásticos",
    "estado": "activo"
  }
]
```
