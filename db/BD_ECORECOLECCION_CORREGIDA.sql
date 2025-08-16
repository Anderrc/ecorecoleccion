-- Script para corregir la base de datos EcoRecolección

-- Usar la base de datos
USE ecorecoleccion;

-- Eliminar tabla Usuarios si existe para recrearla correctamente
DROP TABLE IF EXISTS Recolecciones;
DROP TABLE IF EXISTS Conductores;
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

-- Recrear tabla residuos
CREATE TABLE residuos(
    ID_Residuos int PRIMARY KEY AUTO_INCREMENT,
    Nombre_Residuo varchar(200) NOT NULL,
    Tipo_Recoleccion varchar(200) NOT NULL,
    Punto_Generado int NOT NULL,
    Tipo_Prod int NOT NULL,
    FOREIGN KEY (Punto_Generado) REFERENCES Tienda(Punto_generado)
);

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
    FOREIGN KEY (ID_Residuos) REFERENCES residuos(ID_Residuos),
    FOREIGN KEY (ID_EMP_REC) REFERENCES EMP_REC(ID_EMP_REC)
);

-- Crear tabla de solicitudes (mencionada en el controlador)
CREATE TABLE solicitudes(
    id int PRIMARY KEY AUTO_INCREMENT,
    usuario_id int NOT NULL,
    descripcion text NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado ENUM('pendiente', 'aprobada', 'rechazada') DEFAULT 'pendiente',
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(ID_User)
);

-- Mostrar las tablas creadas
SHOW TABLES;

-- Mostrar estructura de la tabla Usuarios
DESCRIBE Usuarios;
