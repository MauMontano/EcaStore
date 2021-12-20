DROP DATABASE IF EXISTS EcaStore;
CREATE DATABASE EcaStore;
use EcaStore;

create table Comprador(
    IdComprador int(10) AUTO_INCREMENT PRIMARY KEY,
    Nombre varchar(25) not null,
    ApellidoP varchar(25) not null,
    ApellidoM varchar(25) not null,
    Email varchar(50) not null,
    Telefono varchar(25) default null,
    ComPassword varchar(25) not null
);

create table Vendedor(
    IdVendedor int(10) AUTO_INCREMENT PRIMARY KEY,
    Nombre varchar(25) not null,
    ApellidoP varchar(25) not null,
    ApellidoM varchar(25) not null,
    Email varchar(50) not null,
    Telefono varchar(25) default null,
    VenPassword varchar(25) not null,
    RFC varchar(13)
);

create table Categoria(
    IdCategoria int(10) AUTO_INCREMENT PRIMARY KEY,
    NombreCategoria varchar(25) not null
);

create table Estado(
    IdEstado int (10) AUTO_INCREMENT PRIMARY KEY,
    NombreEstado varchar(50) NOT NULL 
);

create table Municipio(
    IdMunicipio int (10) AUTO_INCREMENT PRIMARY KEY,
    NombreMunicipio varchar(50) NOT NULL,
    IdEstado int(10) not null,
    foreign key(IdEstado) references Estado(IdEstado)
);

create table Colonia(
    IdColonia int (10) AUTO_INCREMENT PRIMARY KEY,
    NombreColonia varchar(50) NOT NULL,
    IdMunicipio int(10) not null,
    foreign key(IdMunicipio) references Municipio(IdMunicipio)
);

create table Negocio(
    IdNegocio int(10) AUTO_INCREMENT PRIMARY KEY,
    IdVendedor int(10) not null,
    Nombre varchar(25) not null,
    IdCategoria int(10) not null,
    Descripcion varchar(2000) not null,
    Img varchar(25) not null,
    Telefono varchar(25) not null,
    Email varchar(50) not null,
    CP varchar(6) not null,
    IdEstado int(10) not null,
    IdMunicipio int(10) not null,  
    IdColonia int(10) not null, 
    Region varchar(50) default null,
    Calle varchar(50) not null,
    NumExt int(10) not null,
    NumInt int(10),
    DescripcionReferencia varchar(200),
    foreign key(IdEstado) references Estado(IdEstado),
    foreign key(IdMunicipio) references Municipio(IdMunicipio),
    foreign key(IdColonia) references Colonia(IdColonia),
    foreign key(IdVendedor) references Vendedor(IdVendedor),
    foreign key(IdCategoria) references Categoria(IdCategoria)
);

create table Producto(
    IdProducto int(10) AUTO_INCREMENT PRIMARY KEY,
    IdNegocio int(10) not null,
    Nombre varchar(100) not null,
    Descripcion varchar(2000) not null,
    Caracteristica1 varchar(200) default null,
    Caracteristica2 varchar(200) default null,
    Caracteristica3 varchar(200) default null, 
    Precio int(10) not null, 
    Stock int(10) not null,
    Img1 varchar(25) not null,
    Img2 varchar(25) not null,
    Img3 varchar(25) not null,
    Img4 varchar(25) not null,
    foreign key(IdNegocio) references Negocio(IdNegocio)
);

create table Banco(
    IdBanco int (10) AUTO_INCREMENT PRIMARY KEY,
    NombreBanco varchar(50) not null
);

create table MetodoPago(
    IdMetodoPago int (10) AUTO_INCREMENT PRIMARY KEY,
    IdComprador int(10) not null,
    NombrePropietario varchar(25) not null,
    NumeroTarjeta VARCHAR(16) not null,
    CVV int(3) not null,
    MesVencimiento int(2) not null,
    AñoVencimiento int(4) not null,
    IdBanco int(10) not null,
    foreign key(IdComprador) references Comprador(IdComprador),
    foreign key(IdBanco) references Banco(IdBanco)
);

create table CuentaBancaria(
    IdCuenta int (10) AUTO_INCREMENT PRIMARY KEY,
    IdVendedor int(10) not null,
    numCuenta varchar(18) not null,
    Beneficiario varchar(50) not null,
    claveInterbancaria varchar(25) not null,
    IdBanco int(10) not null,
    foreign key(IdVendedor) references Vendedor(IdVendedor),
    foreign key(IdBanco) references Banco(IdBanco)
);

create table DireccionEnvio(
    IdDireccion int (10) AUTO_INCREMENT PRIMARY KEY,
    IdComprador int(10) not null,
    CP varchar(6) not null,
    IdEstado int(10) not null,
    IdMunicipio int(10) not null,  
    IdColonia int(10) not null, 
    Region varchar(50) default null,
    Calle varchar(50) not null,
    NumExt int(10) not null,
    NumInt int(10),
    NombreContacto varchar(100),
    TelefonoContacto varchar(10),
    DescripcionReferencia varchar(200),
    foreign key(IdComprador) references Comprador(IdComprador),
    foreign key(IdEstado) references Estado(IdEstado),
    foreign key(IdMunicipio) references Municipio(IdMunicipio),
    foreign key(IdColonia) references Colonia(IdColonia)
);

create table DireccionNegocio(
    IdDireccion int (10) AUTO_INCREMENT PRIMARY KEY,
    IdNegocio int(10) not null,
    CP int(5) not null,
    IdEstado int(10) not null,
    IdMunicipio int(10) not null,  
    IdColonia int(10) not null, 
    Region varchar(50) default null,
    Calle varchar(50) not null,
    NumExt int(10) not null,
    NumInt int(10),
    DescripcionReferencia varchar(200),
    foreign key(IdNegocio) references Negocio(IdNegocio),
    foreign key(IdEstado) references Estado(IdEstado),
    foreign key(IdMunicipio) references Municipio(IdMunicipio),
    foreign key(IdColonia) references Colonia(IdColonia)
);

create table CalificaVendedor(
    IdComprador int(10) not null,
    IdVendedor int(10) not null,
    Calificacion int(1) not null,
    Comentario varchar(150) not null,
    primary key(IdComprador,IdVendedor),
    foreign key(IdComprador) references Comprador(IdComprador),
    foreign key(IdVendedor) references Vendedor(IdVendedor)
);

create table CalificaProducto(
    IdComprador int(10) not null,
    IdProducto int(10) not null,
    Calificacion int(1) not null,
    Comentario varchar(150) not null,
    primary key(IdComprador,IdProducto),
    foreign key(IdComprador) references Comprador(IdComprador),
    foreign key(IdProducto) references Producto(IdProducto)
);

create table CarritoCompras(
    IdProducto int(10) not null,
    IdComprador int(10) not null,
    cantidad int(10) not null,
    primary key(IdComprador,IdProducto),
    foreign key(IdComprador) references Comprador(IdComprador),
    foreign key(IdProducto) references Producto(IdProducto)
);


create table Pedido(
    IdPedido int(10) AUTO_INCREMENT PRIMARY KEY,
    IdComprador int(10) not null,
    IdProducto int(10) not null,
    Cantidad int(10) not null,
    IdDireccion int(10) not null,
    IdMetodoPago int(10) not null,
    FechaHora date default null,
    foreign key(IdComprador) references Comprador(IdComprador),
    foreign key(IdProducto) references Producto(IdProducto),
    foreign key(IdDireccion) references DireccionEnvio(IdDireccion),
    foreign key(IdMetodoPago) references MetodoPago(IdMetodoPago)
);

create table HistorialVenta(
    IdHistorial int(10) AUTO_INCREMENT PRIMARY KEY,
    IdNegocio int(10) not null,
    IdProducto int(10) not null,
    Cantidad int(10) not null,
    foreign key(IdNegocio) references Negocio(IdNegocio),
    foreign key(IdProducto) references Producto(IdProducto)
);

create table ProductoEnNegocio(
    IdNegocio int(10) not null,
    IdProducto int(10) not null,
    cantidad int(10) not null,
    primary key(IdNegocio,IdProducto),
    foreign key(IdNegocio) references Negocio(IdNegocio),
    foreign key(IdProducto) references Producto(IdProducto)
);
