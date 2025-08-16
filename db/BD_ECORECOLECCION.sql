create database ecorecoleccion;
use ecorecoleccion;

Create table Rol(
	Rol_ID int primary key not null,
	Nombre varchar (200) not null
);

Create table Usuarios(
	ID_User int primary key not null,
    User_name varchar(200) not null,
    correo varchar (500) not null,
    Contraseña varchar(200) not null,
	Nombre varchar (200) not null,
    Apellidos varchar (200) not null,
    Rol_ID int not null,
    foreign key (Rol_ID) references Rol(Rol_ID)
);

Create table Tienda(
	ID_Tienda int primary key not null,
	Nombre varchar (200) not null,
    Punto_generado int not null Unique,
	Descuento int not null
);

Create table EMP_REC(
	ID_EMP_REC int primary key not null,
	Nombre varchar (200) not null,
    Tipo_recoleccion varchar (200) not null
);
    
Create table Conductores(
	ID_Condu int primary key not null,
    ID_User int not null,
    ID_Empresa int not null,
    foreign key (ID_User) references Usuarios(ID_User),
    foreign key (ID_Empresa) references EMP_REC(ID_EMP_REC)
    );
    
Create table residuos(
	ID_Residuos Int primary key not null,
    Nombre_Residuo varchar(200) not null,
    Tipo_Recoleccion varchar(200) not null,
    Punto_Generado Int not null,
    Tipo_Prod Int not null,
    foreign key (Punto_Generado) references Tienda(Punto_generado)
    );
    
Create table Recolecciones(
	ID_Recol int primary key not null,
    Nombre varchar(200) not null,
    Fecha_Recol date not null,
    ID_User int not null,
    ID_Residuos int not null,
	ID_EMP_REC  int not null,
    foreign key (ID_User) references Usuarios(ID_User),
    foreign key (ID_Residuos) references residuos(ID_Residuos),
    foreign key (ID_EMP_REC) references EMP_REC(ID_EMP_REC)
);