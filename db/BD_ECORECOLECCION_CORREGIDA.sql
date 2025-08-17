-- Script para corregir la base de datos EcoRecolección

-- Usar la base de datos
USE ecorecoleccion;

-- Eliminar tabla Usuarios si existe para recrearla correctamente
DROP TABLE IF EXISTS Recolecciones;
DROP TABLE IF EXISTS Conductores;
DROP TABLE IF EXISTS residuos_criterios;
DROP TABLE IF EXISTS tipos_residuos;
DROP TABLE IF EXISTS criterios_directorio;
DROP TABLE IF EXISTS solicitudes;
DROP TABLE IF EXISTS residuos;
DROP TABLE IF EXISTS Usuarios;
DROP TABLE IF EXISTS Tienda;
DROP TABLE IF EXISTS EMP_REC;
DROP TABLE IF EXISTS Rol;

-- Recrear tabla Rol
CREATE TABLE Rol(
    Rol_ID int PRIMARY KEY AUTO_INCREMENT,
    Nombre varchar(200) NOT NULL
);

-- Insertar roles por defecto
INSERT INTO Rol (Nombre) VALUES 
('Administrador'),
('Recolector'), 
('Usuario');

-- Recrear tabla Usuarios con ID_User AUTO_INCREMENT y nombre de columna correcto
CREATE TABLE Usuarios(
    ID_User int PRIMARY KEY AUTO_INCREMENT,
    User_name varchar(200) NOT NULL UNIQUE,
    correo varchar(500) NOT NULL UNIQUE,
    password varchar(200) NOT NULL,
    Nombre varchar(200) NOT NULL,
    Apellidos varchar(200) NOT NULL,
    Rol_ID int NOT NULL DEFAULT 3,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (Rol_ID) REFERENCES Rol(Rol_ID)
);

-- Recrear tabla Tienda
CREATE TABLE Tienda(
    ID_Tienda int PRIMARY KEY AUTO_INCREMENT,
    Nombre varchar(200) NOT NULL,
    Punto_generado int NOT NULL UNIQUE,
    Descuento int NOT NULL
);

-- Insertar datos de ejemplo en la tabla Tienda
INSERT INTO Tienda (Nombre, Punto_generado, Descuento) VALUES 
('Tienda A', 100, 10),
('Tienda B', 200, 15),
('Tienda C', 300, 20);

-- Recrear tabla EMP_REC
CREATE TABLE EMP_REC(
    ID_EMP_REC int PRIMARY KEY AUTO_INCREMENT,
    Nombre varchar(200) NOT NULL,
    Tipo_recoleccion varchar(200) NOT NULL
);

-- Recrear tabla Conductores
CREATE TABLE Conductores(
    ID_Condu int PRIMARY KEY AUTO_INCREMENT,
    ID_User int NOT NULL,
    ID_Empresa int NOT NULL,
    FOREIGN KEY (ID_User) REFERENCES Usuarios(ID_User),
    FOREIGN KEY (ID_Empresa) REFERENCES EMP_REC(ID_EMP_REC)
);

-- Recrear tabla residuos (nueva estructura moderna)
CREATE TABLE residuos(
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    puntaje_base DECIMAL(10,2) DEFAULT 0.00,
    categoria VARCHAR(50),
    estado ENUM('activo', 'inactivo') DEFAULT 'activo',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insertar datos por defecto en residuos
INSERT INTO residuos (nombre, descripcion, puntaje_base, categoria) VALUES
('Plástico PET', 'Botellas de plástico y envases PET', 10.00, 'Plásticos'),
('Cartón', 'Cajas de cartón y material similar', 5.00, 'Papel y Cartón'),
('Vidrio', 'Botellas y envases de vidrio', 15.00, 'Vidrio'),
('Aluminio', 'Latas de aluminio y materiales similares', 20.00, 'Metales'),
('Papel', 'Hojas de papel, periódicos y revistas', 3.00, 'Papel y Cartón'),
('Plástico HDPE', 'Envases de detergente y productos de limpieza', 8.00, 'Plásticos'),
('Tetra Pak', 'Envases de leche y jugos', 12.00, 'Mixtos'),
('Orgánicos', 'Residuos orgánicos y compostables', 2.00, 'Orgánicos'),
('Inorgánicos', 'Residuos inorgánicos generales', 1.00, 'Inorgánicos'),
('Peligrosos', 'Residuos peligrosos que requieren manejo especial', 25.00, 'Peligrosos');


-- Recrear tabla Recolecciones
CREATE TABLE Recolecciones(
    ID_Recol int PRIMARY KEY AUTO_INCREMENT,
    Nombre varchar(200) NOT NULL,
    Fecha_Recol date NOT NULL,
    ID_User int NOT NULL,
    ID_Residuos int NOT NULL,
    ID_EMP_REC int NOT NULL,
    estado ENUM('pendiente', 'en_proceso', 'completada') DEFAULT 'pendiente',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ID_User) REFERENCES Usuarios(ID_User),
    FOREIGN KEY (ID_Residuos) REFERENCES residuos(id),
    FOREIGN KEY (ID_EMP_REC) REFERENCES EMP_REC(ID_EMP_REC)
);

-- Crear tabla de solicitudes (mencionada en el controlador)
CREATE TABLE solicitudes(
    id int PRIMARY KEY AUTO_INCREMENT,
    usuario_id int NOT NULL,
    descripcion text NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado ENUM('pendiente', 'aprobada', 'rechazada') DEFAULT 'pendiente',
    tipo_residuo INT,
    FOREIGN KEY (tipo_residuo) REFERENCES residuos(id),
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(ID_User)
);

-- Crear tabla directorio para criterios dinámicos
CREATE TABLE IF NOT EXISTS criterios_directorio (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    tipo_dato ENUM('texto', 'numero', 'decimal', 'fecha', 'booleano', 'seleccion') DEFAULT 'texto',
    opciones_seleccion JSON NULL, -- Para cuando tipo_dato sea 'seleccion'
    obligatorio BOOLEAN DEFAULT FALSE,
    orden_visualizacion INT DEFAULT 0,
    estado ENUM('activo', 'inactivo') DEFAULT 'activo',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Crear tabla para criterios específicos de cada tipo de residuo
CREATE TABLE IF NOT EXISTS residuos_criterios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipo_residuo_id INT NOT NULL,
    criterio_id INT NOT NULL,
    valor_por_defecto TEXT NULL,
    multiplicador_puntaje DECIMAL(10,2) DEFAULT 1.00,
    obligatorio BOOLEAN DEFAULT FALSE,
    estado ENUM('activo', 'inactivo') DEFAULT 'activo',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tipo_residuo_id) REFERENCES residuos(id) ON DELETE CASCADE,
    FOREIGN KEY (criterio_id) REFERENCES criterios_directorio(id) ON DELETE CASCADE,
    UNIQUE KEY unique_residuo_criterio (tipo_residuo_id, criterio_id)
);

-- Insertar algunos criterios básicos en el directorio
INSERT IGNORE INTO criterios_directorio (nombre, descripcion, tipo_dato, obligatorio, orden_visualizacion) VALUES
('Peso', 'Peso del residuo en kilogramos', 'decimal', true, 1),
('Estado de Conservación', 'Estado físico del residuo', 'seleccion', true, 2),
('Color', 'Color predominante del residuo', 'seleccion', false, 3),
('Origen', 'Lugar de procedencia del residuo', 'texto', false, 4),
('Cantidad de Unidades', 'Número de piezas individuales', 'numero', false, 5),
('Limpieza', 'Nivel de limpieza del residuo', 'seleccion', true, 6),
('Tamaño', 'Clasificación por tamaño', 'seleccion', false, 7);

-- Actualizar criterios con opciones de selección
UPDATE criterios_directorio 
SET opciones_seleccion = JSON_ARRAY('Excelente', 'Bueno', 'Regular', 'Malo')
WHERE nombre = 'Estado de Conservación';

UPDATE criterios_directorio 
SET opciones_seleccion = JSON_ARRAY('Transparente', 'Verde', 'Azul', 'Marrón', 'Blanco', 'Otro')
WHERE nombre = 'Color';

UPDATE criterios_directorio 
SET opciones_seleccion = JSON_ARRAY('Muy Limpio', 'Limpio', 'Poco Limpio', 'Sucio')
WHERE nombre = 'Limpieza';

UPDATE criterios_directorio 
SET opciones_seleccion = JSON_ARRAY('Pequeño', 'Mediano', 'Grande', 'Extra Grande')
WHERE nombre = 'Tamaño';

-- =====================
-- Tablas de Rutas de Recolección
-- =====================

CREATE TABLE IF NOT EXISTS rutas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    recolector_id INT NULL,
    fecha_asignacion DATE DEFAULT (CURRENT_DATE),
    estado ENUM('asignada','en_progreso','completada') DEFAULT 'asignada',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (recolector_id) REFERENCES Usuarios(ID_User)
);

CREATE TABLE IF NOT EXISTS rutas_puntos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ruta_id INT NOT NULL,
    direccion VARCHAR(255) NOT NULL,
    lat DECIMAL(10,6) NULL,
    lng DECIMAL(10,6) NULL,
    estado ENUM('pendiente','en_proceso','completado') DEFAULT 'pendiente',
    orden INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ruta_id) REFERENCES rutas(id) ON DELETE CASCADE
);

-- Datos de ejemplo para rutas
INSERT INTO rutas (nombre, descripcion, recolector_id, fecha_asignacion, estado)
SELECT * FROM (
    SELECT 'Ruta Norte - Chapinero', 'Recolección en zona residencial norte', 2, CURDATE(), 'en_progreso' UNION ALL
    SELECT 'Ruta Sur - Kennedy', 'Recolección en zona comercial sur', 2, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 'completada' UNION ALL
    SELECT 'Ruta Centro', 'Recolección en zona centro histórico', 2, CURDATE(), 'asignada'
) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM rutas);

INSERT INTO rutas_puntos (ruta_id, direccion, lat, lng, estado, orden)
SELECT r.id, p.direccion, p.lat, p.lng, p.estado, p.orden FROM rutas r
JOIN (
    SELECT 'Ruta Norte - Chapinero' nombre_ruta, 'Calle 63 #11-20' direccion, 4.635100 lat, -74.066900 lng, 'completado' estado, 1 orden UNION ALL
    SELECT 'Ruta Norte - Chapinero', 'Carrera 7 #70-15', 4.640100, -74.064900, 'en_proceso', 2 UNION ALL
    SELECT 'Ruta Norte - Chapinero', 'Calle 72 #8-30', 4.642100, -74.062900, 'pendiente', 3 UNION ALL
    SELECT 'Ruta Sur - Kennedy', 'Carrera 86 #40-50', 4.600100, -74.146900, 'completado', 1 UNION ALL
    SELECT 'Ruta Sur - Kennedy', 'Calle 38 sur #78-20', 4.598100, -74.144900, 'completado', 2 UNION ALL
    SELECT 'Ruta Centro', 'Carrera 10 #26-51', 4.610100, -74.074900, 'pendiente', 1 UNION ALL
    SELECT 'Ruta Centro', 'Calle 19 #7-30', 4.603100, -74.071900, 'pendiente', 2
) p ON p.nombre_ruta = r.nombre
WHERE NOT EXISTS (SELECT 1 FROM rutas_puntos);

-- Mostrar las tablas creadas
SHOW TABLES;

-- Mostrar estructura de la tabla Usuarios
DESCRIBE Usuarios;
