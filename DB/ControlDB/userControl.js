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
    updateBuyer: (buyer,buyerId) =>{
        return new Promise((resolve,reject)=>{
            //connecting with th database
            //buyer
            pool.query('UPDATE Comprador SET Nombre = ?, ApellidoP = ?, ApellidoM = ?, Email = ?, Telefono = ?, ComPassword = ? WHERE IdComprador = ?', [buyer.name, buyer.apat, buyer.amat, buyer.email, buyer.phone, buyer.password, buyerId], (error, result) =>{
                if(error){
                    return reject(error);
                }
                return resolve(1)
            })
            
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
    getBuyerById: buyerId =>{
        return new Promise((resolve,reject)=>{
            pool.query('SELECT IdComprador AS id, Nombre AS name, ApellidoP AS apat, ApellidoM AS amat, Email AS email, Telefono AS phone, ComPassword AS password FROM Comprador WHERE IdComprador = ?',[buyerId], function (error, results, fields) {
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
        });
    },
    registerAddress: (regAdd, buyerId) =>{
        return new Promise((resolve,reject)=>{
            // Succesfully connected
            pool.query('INSERT INTO DireccionEnvio(IdComprador, CP, IdEstado, IdMunicipio, IdColonia, Calle, NumExt, NumInt, NombreContacto, TelefonoContacto, DescripcionReferencia) VALUES (?,?,?,?,?,?,?,?,?,?,?)',[buyerId, "55000", 1, 1, 1, regAdd.street, regAdd.numExt, regAdd.numInt, regAdd.name, regAdd.phone, regAdd.descriptionReference], function (error, results, fields) {
                if(error){
                    return reject(error);
                }
                console.log(results)
                return resolve(1);
            });
        });
    },
    registerPaymentMethod: (regPayMethod, buyerId) =>{
        return new Promise((resolve,reject)=>{
            // Succesfully connected
            pool.query('INSERT INTO MetodoPago(IdComprador, NombrePropietario, NumeroTarjeta, CVV, MesVencimiento, AñoVencimiento, idBanco) VALUES (?,?,?,?,?,?,?)',[buyerId, regPayMethod.ownerName, regPayMethod.numCard, regPayMethod.cvv, regPayMethod.month, regPayMethod.year, regPayMethod.bankId], function (error, results, fields) {
                if(error){
                    return reject(error);
                }
                console.log(results)
                return resolve(1);
            });
        });
    },
    registerStore: (regStore, sellerId) =>{
        return new Promise((resolve,reject)=>{
            // Succesfully connected
            pool.query('INSERT INTO Negocio(IdVendedor,Nombre, IdCategoria, Descripcion, IMG, Telefono, Email, CP, IdEstado, IdMunicipio, IdColonia, Calle, NumExt, NumInt, DescripcionReferencia) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',[sellerId,regStore.name, regStore.category, regStore.description, regStore.img, regStore.phone, regStore.email, "55000", 1, 1, 1, regStore.street, regStore.numExt, regStore.numInt, regStore.descriptionReference], function (error, results, fields) {
                if(error){
                    return reject(error);
                }
                console.log(results)
                return resolve(1);
            });
        });
    },
    registerProduct: (regProduct) =>{
        return new Promise((resolve,reject)=>{
            // Succesfully connected
            pool.query('INSERT INTO Producto(IdNegocio,Nombre, Descripcion,Caracteristica1, Caracteristica2, Caracteristica3, Precio, Stock, Img1, Img2, Img3, Img4) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)',[regProduct.storeId,regProduct.name, regProduct.description, regProduct.carac1, regProduct.carac2, regProduct.carac3, regProduct.price, regProduct.stock, regProduct.img1, regProduct.img2, regProduct.img3, regProduct.img4], function (error, results, fields) {
                if(error){
                    return reject(error);
                }
                console.log(results)
                return resolve(1);
            });
        });
    },
    updateProduct: (product,storeId) =>{
        return new Promise((resolve,reject)=>{
            console.log("I am herrreeeeeeeeee Selected Product id: ");
            console.log(product.productId);
            console.log("Selected Store id: ");
            console.log(storeId);
            pool.query('UPDATE Producto SET Nombre = ?, Descripcion = ?, Caracteristica1 = ?, Caracteristica2 = ?, Caracteristica3 = ?, Precio = ?, Stock = ?, Img1 = ?, Img2 = ?, Img3 = ?, Img4 = ? WHERE IdProducto = ? AND IdNegocio = ?', [product.name, product.description, product.carac1, product.carac2, product.carac3, product.price, product.stock, product.img1, product.img2, product.img3, product.img4, product.productId, storeId], (error, result) =>{
                if(error){
                    return reject(error);
                }
                return resolve(1)
            })
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
            pool.query('SELECT Producto.IdProducto AS id, Producto.Nombre AS name, Producto.Descripcion AS description, Producto.Precio AS price, Categoria.NombreCategoria AS category, Producto.Stock AS stock, Producto.Img1 AS img, Negocio.Nombre AS store, CarritoCompras.cantidad AS quantity FROM Categoria INNER JOIN Negocio ON Categoria.IdCategoria = Negocio.IdCategoria INNER JOIN Producto ON Negocio.IdNegocio = Producto.IdNegocio INNER JOIN CarritoCompras ON Producto.IdProducto = CarritoCompras.IdProducto WHERE CarritoCompras.IdComprador = ?',[buyerId], function (error, results, fields) {
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
            pool.query('SELECT DireccionEnvio.IdDireccion as id, DireccionEnvio.CP AS cp, Estado.NombreEstado AS state, DireccionEnvio.Region AS region, Municipio.NombreMunicipio AS muni, Colonia.NombreColonia AS colony, DireccionEnvio.Calle AS street, DireccionEnvio.NumExt AS numExt, DireccionEnvio.NumInt AS numInt, DireccionEnvio.NombreContacto AS contactName, DireccionEnvio.TelefonoContacto AS contactPhone FROM DireccionEnvio INNER JOIN Estado ON DireccionEnvio.IdEstado = Estado.IdEstado INNER JOIN Municipio ON Municipio.IdMunicipio = DireccionEnvio.IdMunicipio INNER JOIN Colonia ON Colonia.IdColonia = DireccionEnvio.IdColonia WHERE DireccionEnvio.IdComprador = ?',[buyerId], function (error, results, fields) {
                if(error){
                    return reject(error);
                }
                console.log(results)
                return resolve(results);
            });
        });
    },
    getStores: () => {
        return new Promise((resolve,reject)=>{
            // Succesfully connected
            pool.query('SELECT IdNegocio AS id, Nombre AS name, Descripcion AS description, Img AS img FROM Negocio LIMIT 15',[], function (error, results, fields) {
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
            pool.query('SELECT Negocio.Nombre AS store, Producto.IdProducto AS id, Producto.Nombre AS name, Producto.Descripcion AS description, Producto.Precio AS price, Producto.Img1 AS img FROM Negocio INNER JOIN Producto ON Negocio.IdNegocio = Producto.IdNegocio LIMIT 15',[], function (error, results, fields) {
                if(error){
                    return reject(error);
                }
                console.log(results)
                return resolve(results);
            });
        });
    },
    getProductsbyStoreId: storeId => {
        return new Promise((resolve,reject)=>{
            // Succesfully connected
            pool.query('SELECT Negocio.Nombre AS store, Producto.IdProducto AS id, Producto.Nombre AS name, Producto.Descripcion AS description, Producto.Precio AS price, Producto.Img1 AS img FROM Negocio INNER JOIN Producto ON Negocio.IdNegocio = Producto.IdNegocio WHERE Negocio.IdNegocio = ?',[storeId], function (error, results, fields) {
                if(error){
                    return reject(error);
                }
                console.log(results)
                return resolve(results);
            });
        });
    },
    //Bring every product of the store
    getStoreIdByProductId: productId => {
        return new Promise((resolve,reject)=>{
            // Succesfully connected
            pool.query('SELECT IdNegocio AS storeId, Nombre AS name FROM Producto WHERE IdProducto = ?',[productId], function (error, results, fields) {
                if(error){
                    return reject(error);
                }
                console.log("Store id result:");
                console.log(results[0])
                return resolve(results[0]);
            });
        });
    },
    getStoresBySellerId: sellerId => {
        return new Promise((resolve,reject)=>{
            // Succesfully connected
            pool.query('SELECT IdNegocio AS id, Nombre AS name, Descripcion AS description, Img AS img FROM Negocio WHERE IdVendedor = ?',[sellerId], function (error, results, fields) {
                if(error){
                    return reject(error);
                }
                //console.log("Product data:");
                console.log(results)
                return resolve(results);
            });
        });
    },
    getProductbyId: productId => {
        return new Promise((resolve,reject)=>{
            // Succesfully connected
            pool.query('SELECT Negocio.Nombre AS store, Producto.IdProducto AS id, Producto.Nombre AS name,Categoria.NombreCategoria AS category, Producto.Descripcion AS description, Producto.Caracteristica1 AS carac1, Producto.Caracteristica2 AS carac2, Producto.Caracteristica3 AS carac3, Producto.Precio AS price, Producto.Stock AS stock, Producto.Img1 AS img1, Producto.Img2 AS img2, Producto.Img3 AS img3, Producto.Img4 AS img4  FROM Categoria INNER JOIN Negocio ON Negocio.IdCategoria = Categoria.IdCategoria INNER JOIN Producto ON Negocio.IdNegocio = Producto.IdNegocio WHERE Producto.idProducto = ?',[productId], function (error, results, fields) {
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
    deleteProductFromCart: (productId, buyerId) => {
        return new Promise((resolve,reject)=>{
            pool.query('DELETE FROM CarritoCompras WHERE IdProducto = ? AND IdComprador = ?',[productId, buyerId], function (error, results, fields) {
                if(error){
                    return reject(error);
                }
                return resolve(1);
            });
        });
    },
    modifyProductStock: (product, stock) => {
        return new Promise((resolve,reject)=>{
            // Succesfully connected
            console.log("Stock: ");
            console.log(stock.stock);
            console.log("Product Quantity: ");
            console.log(product.productQuantity);
            var newProductStock = stock.stock - product.productQuantity;
            console.log("New Stock: ");
            console.log(newProductStock); 
            pool.query('UPDATE Producto SET Stock = ? WHERE IdProducto = ?',[newProductStock, product.productId], function (error, results, fields) {
                if(error){
                    return reject(error);
                }
                return resolve(1);
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
    addingProductToSalesRecord: (body, storeId) => {
        return new Promise((resolve,reject)=>{
            // Succesfully connected
            pool.query('INSERT INTO HistorialVenta(IdNegocio, IdProducto, Cantidad) VALUES (?,?,?)',[storeId, body.productId, body.productQuantity ], function (error, results, fields) {
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
            pool.query('SELECT Producto.Nombre AS productName, Producto.Precio AS price, Producto.Descripcion AS productDescription, Producto.Img1 AS img, DireccionEnvio.CP AS cp, Estado.NombreEstado AS state, DireccionEnvio.Region AS region, Municipio.NombreMunicipio AS muni, Colonia.NombreColonia AS colony, DireccionEnvio.Calle AS street, DireccionEnvio.NumExt AS numExt, DireccionEnvio.NumInt AS numInt, DireccionEnvio.NombreContacto AS contactName, DireccionEnvio.TelefonoContacto AS contactPhone, MetodoPago.NumeroTarjeta AS numTarjeta, Pedido.Cantidad AS quantity FROM DireccionEnvio INNER JOIN Estado ON DireccionEnvio.IdEstado = Estado.IdEstado INNER JOIN Municipio ON Municipio.IdMunicipio = DireccionEnvio.IdMunicipio INNER JOIN Colonia ON Colonia.IdColonia = DireccionEnvio.IdColonia INNER JOIN Pedido ON DireccionEnvio.IdDireccion = Pedido.IdDireccion INNER JOIN Comprador ON Pedido.IdComprador = Comprador.IdComprador INNER JOIN Producto ON Pedido.IdProducto = Producto.IdProducto INNER JOIN MetodoPago ON Pedido.IdMetodoPago = MetodoPago.IdMetodoPago WHERE Pedido.IdComprador = ?',[buyerId], function (error, results, fields) {
                if(error){
                    return reject(error);
                }
                console.log(results)
                return resolve(results);
            });
        });
    },
    getSalesRecord: (storeId) => {
        return new Promise((resolve,reject)=>{
            // Succesfully connected
            pool.query('SELECT Producto.Nombre AS productName, Producto.Precio AS price, Producto.Descripcion AS productDescription, Producto.Img1 AS img, HistorialVenta.Cantidad AS quantity FROM HistorialVenta INNER JOIN Producto ON HistorialVenta.IdProducto = Producto.IdProducto INNER JOIN Negocio ON Producto.IdNegocio = Negocio.IdNegocio  WHERE HistorialVenta.IdNegocio = ?',[storeId], function (error, results, fields) {
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