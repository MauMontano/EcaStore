const mysql = require('mysql');
const pool = require('./pool.js').pool;


const UserDB = {
    validUserExistence: userData =>{
        return new Promise((resolve,reject)=>{
            //connecting with th database
            console.log(userData);
            pool.query('SELECT IdVendedor FROM Vendedor WHERE Email = ? LIMIT 1',[userData.email], function (error, results, fields) {
                if(error){
                    return reject(error);
                }
                console.log("Seller results: ");
                console.log(results);
                //user not exists in sellers
                if (results.length < 1) {
                    pool.query('SELECT IdComprador FROM Comprador WHERE Email = ? LIMIT 1',[userData.email], function (error, buyerResults, fields) {
                        if(error){
                            return reject(error);
                        }
                        console.log(buyerResults);
                        //user not exists in sellers
                        if (buyerResults.length < 1) {
                            console.log("1 Yeiiiiiiiii");
                            return resolve(1);
                        }
                        return resolve(-1);              
                    });
                }
                else{
                    return resolve(-1);              
                }
            });
        });
    },
    registerUser: regUser =>{
        return new Promise((resolve,reject)=>{
            //connecting with th database
            //buyer
            if(regUser.userType == 0){
                pool.query('INSERT INTO Comprador(Nombre, ApellidoP, ApellidoM, Email, Telefono, ComPassword) VALUES (?,?,?,?,?,?)', [regUser.name, regUser.apat, regUser.amat, regUser.email, regUser.phone, regUser.password], (error, result) =>{
                    if(error){
                        return reject(error);
                    }
                    return resolve(0)
                })
            }
            //seller
            else{
                pool.query('INSERT INTO Vendedor(Nombre, ApellidoP, ApellidoM, Email, Telefono, VenPassword, RFC) VALUES (?,?,?,?,?,?,?)', [regUser.name, regUser.apat, regUser.amat, regUser.email, regUser.phone, regUser.password, regUser.rfc], (error, result) =>{
                    if(error){
                        return reject(error);
                    }
                    return resolve(1)
                })
            }
        });
    },
    loginUser: loginUser =>{
        return new Promise((resolve,reject)=>{
            if(loginUser.userType == 0){
                pool.query('SELECT IdComprador FROM Comprador WHERE Email = ? LIMIT 1',[loginUser.email], function (error, results, fields) {
                    if(error){
                        return reject(error);
                    }
                    console.log(results);
                    //user not exists in buyers
                    if (results.length < 1) {
                        return resolve('Lo sentimos, no existe ningún comprador con ese email');     
                    }
                    else{
                        pool.query('SELECT ComPassword AS password FROM Comprador WHERE Email = ? LIMIT 1',[loginUser.email], function (error, results, fields) {
                            if(error){
                                return reject(error);
                            }
                            console.log(results);
                            //user not exists in buyers
                            if (loginUser.password != results[0].password ) {
                                return resolve('La contraseña es incorrecta. Intentelo de nuevo ');     
                            }
                            //buyer login 
                            else{
                                return resolve(0);
                            }
                            // And done with the connection.
                            //connection.release();
                        
                        });
                    }
                });
            }
            //login for seller
            else{
                pool.query('SELECT IdVendedor FROM Vendedor WHERE Email = ? LIMIT 1',[loginUser.email], function (error, results, fields) {
                    if(error){
                        return reject(error);
                    }
                    console.log(results);
                    //user not exists in buyers
                    if (results.length < 1) {
                        return resolve('Lo sentimos, no existe ningún vendedor con ese email');     
                    }
                    else{
                        pool.query('SELECT VenPassword AS password FROM Vendedor WHERE Email = ? LIMIT 1',[loginUser.email], function (error, results, fields) {
                            if(error){
                                return reject(error);
                            }
                            console.log(results);
                            //user not exists in buyers
                            if (loginUser.password != results[0].password ) {
                                return resolve('La contraseña es incorrecta. Intentelo de nuevo ');     
                            }
                            //buyer login 
                            else{
                                return resolve(1);
                            }
                            // And done with the connection.
                            //connection.release();
                        
                        });
                    }
                });
            }
        });

    },
    getUserName: userData =>{
        return new Promise((resolve,reject)=>{
            if(userData.userType == 0){
                pool.query('SELECT Nombre AS name, IdComprador AS id FROM Comprador WHERE Email = ? LIMIT 1',[userData.email], function (error, results, fields) {
                    if(error){
                        return reject(error);
                    }
                    console.log(results);
                    //user not exists in buyers
                    if (results.length < 1) {
                        return resolve(0);     
                    }
                    else{
                        return resolve(results[0]);
                    }
                });
            }
            //Seller name
            else{
                pool.query('SELECT Nombre AS name, IdVendedor AS id FROM Vendedor WHERE Email = ? LIMIT 1',[userData.email], function (error, results, fields) {
                    if(error){
                        return reject(error);
                    }
                    console.log(results);
                    //user not exists in buyers
                    if (results.length < 1) {
                        return resolve(1);     
                    }
                    else{
                        return resolve(results[0]);
                    }
                });
            }
        });
    },
    registerProduct: (regProduct, sellerId) =>{
        return new Promise((resolve,reject)=>{
            // Succesfully connected
            pool.query('INSERT INTO Producto(IdVendedor,Nombre, Descripcion,Caracteristica1, Caracteristica2, Caracteristica3, IdCategoria, Precio, Stock, Img1, Img2, Img3, Img4) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)',[sellerId,regProduct.name, regProduct.description, regProduct.carac1, regProduct.carac2, regProduct.carac3, regProduct.category, regProduct.price, regProduct.stock, regProduct.img1, regProduct.img2, regProduct.img3, regProduct.img4], function (error, results, fields) {
                if(error){
                    return reject(error);
                }
                console.log(results)
                return resolve(1);
            });
        });
    },
    validAddToCart: (productId, buyerId) =>{
        return new Promise((resolve,reject)=>{
            //connecting with th database
            pool.query('SELECT IdProducto FROM CarritoCompras WHERE IdProducto = ? AND IdComprador = ?',[productId, buyerId, 1], function (error, results, fields) {
                if(error){
                    return reject(error);
                }
                console.log(results)
                if(results.length > 0)
                    return resolve(-1);
                return resolve(1)
                // And done with the connection.
                //connection.release();
            });
        });
    },
    addToCart: (productId, buyerId) =>{
        return new Promise((resolve,reject)=>{
            pool.query('INSERT INTO CarritoCompras(IdProducto,IdComprador, cantidad) VALUES (?,?,?)',[productId, buyerId, 1], function (error, results, fields) {
                if(error){
                    return reject(error);
                }
                console.log(results)
                return resolve(1);
                // And done with the connection.
                //connection.release();
            });
        });
    },
    getBuyerCart: buyerId => {
        return new Promise((resolve,reject)=>{
            // Succesfully connected
            pool.query('SELECT Producto.IdProducto AS id, Producto.Nombre AS name, Producto.Descripcion AS description, Producto.Precio AS price, Categoria.NombreCategoria AS category, Producto.Stock AS stock, Producto.Img1 as img, Vendedor.Nombre AS seller, CarritoCompras.cantidad AS quantity FROM Vendedor INNER JOIN Producto ON Vendedor.IdVendedor = Producto.IdVendedor INNER JOIN Categoria ON Categoria.IdCategoria = Producto.IdCategoria INNER JOIN CarritoCompras ON Producto.IdProducto = CarritoCompras.IdProducto WHERE CarritoCompras.IdComprador = ?',[buyerId], function (error, results, fields) {
                if(error){
                    return reject(error);
                }
                console.log(results)
                return resolve(results);
            });
        });
    },
    getPaymentMethod: buyerId => {
        return new Promise((resolve,reject)=>{
            // Succesfully connected
            pool.query('SELECT MetodoPago.IdMetodoPago AS id, MetodoPago.NombrePropietario  AS ownerName, MetodoPago.NumeroTarjeta AS number, MetodoPago.CVV AS cvv, MetodoPago.MesVencimiento AS month, MetodoPago.AñoVencimiento AS year, Banco.NombreBanco AS bankName FROM MetodoPago INNER JOIN Banco ON Banco.IdBanco = MetodoPago.IdBanco WHERE IdComprador = ?',[buyerId], function (error, results, fields) {
                if(error){
                    return reject(error);
                }
                console.log(results)
                return resolve(results);
            });
        });
    },
    getBuyerDirection: buyerId => {
        return new Promise((resolve,reject)=>{
            // Succesfully connected
            pool.query('SELECT Direccion.IdDireccion as id, Direccion.CP AS cp, Estado.NombreEstado AS state, Direccion.Region AS region, Municipio.NombreMunicipio AS muni, Colonia.NombreColonia AS colony, Direccion.Calle AS street, Direccion.NumExt AS numExt, Direccion.NumInt AS numInt, Direccion.NombreContacto AS contactName, Direccion.TelefonoContacto AS contactPhone FROM Direccion INNER JOIN Estado ON Direccion.IdEstado = Estado.IdEstado INNER JOIN Municipio ON Municipio.IdMunicipio = Direccion.IdMunicipio INNER JOIN Colonia ON Colonia.IdColonia = Direccion.IdColonia WHERE Direccion.IdComprador = ?',[buyerId], function (error, results, fields) {
                if(error){
                    return reject(error);
                }
                console.log(results)
                return resolve(results);
            });
        });
    },
    getProducts: () => {
        return new Promise((resolve,reject)=>{
            // Succesfully connected
            pool.query('SELECT Vendedor.Nombre AS seller, Producto.IdProducto AS id, Producto.Nombre AS name, Producto.Descripcion AS description, Producto.Precio AS price, Producto.Img1 AS img FROM Vendedor INNER JOIN Producto ON Vendedor.IdVendedor = Producto.IdVendedor LIMIT 15',[], function (error, results, fields) {
                if(error){
                    return reject(error);
                }
                console.log(results)
                return resolve(results);
            });
        });
    },
    getProductbyId: productId => {
        return new Promise((resolve,reject)=>{
            // Succesfully connected
            pool.query('SELECT Vendedor.Nombre AS seller, Producto.IdProducto AS id, Producto.Nombre AS name,Categoria.NombreCategoria AS category, Producto.Descripcion AS description, Producto.Caracteristica1 AS carac1, Producto.Caracteristica2 AS carac2, Producto.Caracteristica3 AS carac3, Producto.Precio AS price, Producto.Img1 AS img FROM Vendedor INNER JOIN Producto ON Vendedor.IdVendedor = Producto.IdVendedor INNER JOIN Categoria ON Categoria.IdCategoria = Producto.IdCategoria WHERE Producto.idProducto = ?',[productId], function (error, results, fields) {
                if(error){
                    return reject(error);
                }
                //console.log("Product data:");
                //console.log(results)
                return resolve(results[0]);
            });
        });
    },
    getProductQuantity: productId => {
        return new Promise((resolve,reject)=>{
            // Succesfully connected
            pool.query('SELECT Stock AS stock FROM Producto WHERE IdProducto = ?',[productId], function (error, results, fields) {
                if(error){
                    return reject(error);
                }
                //console.log("Product data:");
                console.log(results)
                return resolve(results[0]);
            });
        });
    },
    modifyProductUnits: (body, buyerId) => {
        return new Promise((resolve,reject)=>{
            // Succesfully connected
            pool.query('UPDATE CarritoCompras SET cantidad = ? WHERE IdProducto = ? AND IdComprador = ?',[body.numUnits, body.productId, buyerId], function (error, results, fields) {
                if(error){
                    return reject(error);
                }
                return resolve(1);
            });
        });
    },
    payCart: (body, buyerId) => {
        return new Promise((resolve,reject)=>{
            // Succesfully connected
            pool.query('INSERT INTO Pedido(IdComprador, IdProducto, Cantidad, IdDireccion, IdMetodoPago) VALUES (?,?,?,?,?)',[buyerId, body.productId, body.productQuantity, body.directionId, body.methodId ], function (error, results, fields) {
                if(error){
                    return reject(error);
                }
                return resolve(1);
            });
        });
    },
    getHistorial: (buyerId) => {
        return new Promise((resolve,reject)=>{
            // Succesfully connected
            pool.query('SELECT Producto.Nombre AS productName, Producto.Precio AS price, Producto.Descripcion AS productDescription, Producto.Img1 AS img, Direccion.CP AS cp, Estado.NombreEstado AS state, Direccion.Region AS region, Municipio.NombreMunicipio AS muni, Colonia.NombreColonia AS colony, Direccion.Calle AS street, Direccion.NumExt AS numExt, Direccion.NumInt AS numInt, Direccion.NombreContacto AS contactName, Direccion.TelefonoContacto AS contactPhone, MetodoPago.NumeroTarjeta AS numTarjeta, Pedido.Cantidad AS quantity FROM Direccion INNER JOIN Estado ON Direccion.IdEstado = Estado.IdEstado INNER JOIN Municipio ON Municipio.IdMunicipio = Direccion.IdMunicipio INNER JOIN Colonia ON Colonia.IdColonia = Direccion.IdColonia INNER JOIN Pedido ON Direccion.IdDireccion = Pedido.IdDireccion INNER JOIN Comprador ON Pedido.IdComprador = Comprador.IdComprador INNER JOIN Producto ON Pedido.IdProducto = Producto.IdProducto INNER JOIN MetodoPago ON Pedido.IdMetodoPago = MetodoPago.IdMetodoPago WHERE Pedido.IdComprador = ?',[buyerId], function (error, results, fields) {
                if(error){
                    return reject(error);
                }
                console.log(results)
                return resolve(results);
            });
        });
    },
};
module.exports = UserDB;