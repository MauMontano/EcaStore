const express = require('express');
const session = require('express-session');
const router = express.Router();
const DB = require('../DB/ControlDB/userControl');
const sendEmail = require('../SendEmail/sendEmail');
const path = require('path');
const body_parser = require('body-parser');

router.use(body_parser.json());
router.use(body_parser.urlencoded({extended: true}));

router.use(session({
  secret: 'digiSession',
  resave: false,
  saveUninitialized:false,
  //cookie: { secure: true }
}));

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('home');
});

/* Login page */
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'IGITIENDA' });
});

/* Register page */
router.get('/register', function(req, res, next) {
  res.render('register', { title: 'IGITIENDA' });
});

router.post('/sendEmail',(req,res)=>{
  const body = req.body;
  DB.validUserExistence(body).then(result=>{
    //The user already exists
    console.log(result);
    if(result == -1){
        return res.send({ status: -1, message: "El correo electrónico que intenta registrar ya está asociado con otra cuenta"});
    }
    sendEmail.sendData(body).then(result=>{
      if (result ==-1 ){
          return res.send({status: -1, message:"Algo salio mal al enviar el correo, revisa que esté activo"})
      }
      return res.send({status: 1, message:"Se ha enviado un correo de verificación a "+req.body.email});
    });
  });
});

router.post('/registerUser',(req,res)=>{
  //getting the body of the request
  const body = req.body;
  console.log(body);
  DB.registerUser(body).then(regUser=>{
      if(regUser == 0)
        return res.send({status: 0, message: "Registo como comprador exitoso."});
      return res.send({status: 1, message: "Registro como vendedor exitoso."});
  });
});

router.post('/updateBuyer',(req,res)=>{
  //getting the body of the request
  const body = req.body;
  const buyerId = req.session.userid;
  console.log(body);
  DB.updateBuyer(body, buyerId).then(updateState=>{
    if(updateState == 1){
      return res.send({ message: "Datos modificados con éxito. Recargue la página"});
    }
    return res.send({message: "Algo salió mal, intente de nuevo"});
  });
});


router.post('/loginUser',(req,res)=>{
  //getting the body of the request
  const body = req.body;
  console.log(body);
  DB.loginUser(body).then(loginUser=>{
      if(loginUser != 0 && loginUser != 1){
          return res.send({status: -1, message: loginUser});
      }
      DB.getUserName(body).then(userData=>{
        if(userData != 0 && userData != 1){
          req.session.username = userData.name;
          req.session.userid = userData.id;
          console.log("Nombre back:" + req.session.username);
          console.log("id back " + req.session.userid);  
          //buyer
          if(loginUser == 0)
            return res.send({status: 0});
          return res.send({status: 1});
        }
      });
  });
});

/* buyerHome */
router.get('/buyerHome', function(req, res, next) {
  if(!req.session.username){
		return res.redirect('/users/login');
  }
  DB.getStores().then(stores =>{
    console.log("Negocios");
    console.log(stores);
    res.render('buyer/buyerHome', { 
      title: 'EcaStore',
      username: req.session.username,
      userid: req.session.userid,
      stores: stores });
  });
});

/* sellerHome */
router.get('/sellerHome', function(req, res, next) {
  if(!req.session.username){
		return res.redirect('/users/login');
  }
  DB.getStores().then(stores =>{
    console.log("Negocios");
    console.log(stores);
    res.render('seller/sellerHome', { title: 'EcaStore', username: req.session.username, userid: req.session.userid, stores: stores });
  });
  /* var products = [
    { name: 'Zapato escolar', description: "Descripción del producto", price: 500},
    { name: 'Carro control remoto', description: "Descripción del producto", price: 500},
    { name: 'Taladro eléctrico', description: "Descripción del producto", price: 500},
    { name: 'Guantes de cocina', description: "Descripción del producto", price: 500},
    { name: 'Martillo 3000', description: "Descripción del producto", price: 500},
    { name: 'Licuadora 300', description: "Descripción del producto", price: 500},
    { name: 'Huawaii P30', description: "Descripción del producto", price: 500},
    { name: 'Nike air force 1', description: "Descripción del producto", price: 500},
    { name: 'Botas de trabajo', description: "Descripción del producto", price: 500},
  ];
  //console.log("Nombre: " + req.session.username);
  res.render('seller/sellerHome', { title: 'IGITIENDA', username: req.session.username, userid: req.session.userid, products: products }); */
});

router.post('/registerStore',(req,res)=>{
  //getting the body of the request
  const body = req.body;
  const sellerId = req.session.userid;
  console.log(body);
  console.log("sellerid: " + sellerId);
  DB.registerStore(body, sellerId).then(regProd=>{
      if(regProd == 1){
          return res.send({ message: "Su negocio se ha registrado con éxito"});
      }
      return res.send({message: "Algo salió mal, intente de nuevo"});
  });
});

router.post('/registerAddress',(req,res)=>{
  //getting the body of the request
  const body = req.body;
  const buyerId = req.session.userid;
  console.log(body);
  console.log("buyerId: " + buyerId);
  DB.registerAddress(body, buyerId).then(regAdd=>{
      if(regAdd == 1){
          return res.send({ message: "Dirección de envio registrada con éxito"});
      }
      return res.send({message: "Algo salió mal, intente de nuevo"});
  });
});

router.post('/registerPaymentMethod',(req,res)=>{
  //getting the body of the request
  const body = req.body;
  const buyerId = req.session.userid;
  console.log(body);
  console.log("buyerId: " + buyerId);
  DB.registerPaymentMethod(body, buyerId).then(regAdd=>{
      if(regAdd == 1){
          return res.send({ message: "Método de pago registrado con éxito"});
      }
      return res.send({message: "Algo salió mal, intente de nuevo"});
  });
});

router.post('/registerProduct',(req,res)=>{
  //getting the body of the request
  const body = req.body;
  //const sellerId = req.session.userid;
  console.log(body);
  //console.log("sellerid: " + sellerId);
  DB.registerProduct(body).then(regProd=>{
      if(regProd == 1){
          return res.send({ message: "Producto registrado con éxito"});
      }
      return res.send({message: "Algo salió mal, intente de nuevo"});
  });
});

router.post('/updateProduct',(req,res)=>{
  //getting the body of the request
  const body = req.body;
  //const sellerId = req.session.userid;
  console.log("Product data: ");
  console.log(body.productId);
  //console.log("sellerid: " + sellerId);
  DB.getStoreIdByProductId(body.productId).then(store=>{
    var storeId = store;
    console.log("StoreId: ");
    console.log(storeId.storeId);
    DB.updateProduct(body, storeId.storeId).then(updateProd=>{
      if(updateProd == 1){
          return res.send({ message: "Datos modificados con éxito. Recargue la Página"});
      }
      return res.send({message: "Algo salió mal, intente de nuevo"});
    });
  });
});

/**
 * Funcition for add product to the car
 */
router.post('/addToCart',(req,res)=>{
  //getting the body of the request
  const body = req.body.productId;
  const buyerId = req.session.userid;
  console.log("productid: " + body);
  console.log("sellerid: " + buyerId);
  DB.validAddToCart(body, buyerId).then(result =>{
    //The product is already on the cart
    if(result == -1)
      return res.send({status: 0, message: "Ese producto ya ha sido añadido al carrito previamente"});
    else{
      DB.addToCart(body, buyerId).then(result=>{
        if(result == 1){
            return res.send({ status: 1 ,message: "Producto añadido al carrito con éxito"});
        }
        return res.send({status: -1, message: "Algo salió mal, intente de nuevo"});
      });
    }
  }).catch(console.error)
});

router.get('/cart', function(req, res, next) {
  if(!req.session.username){
		return res.redirect('/users/login');
  }
  //console.log("Nombre: " + req.session.username);
  DB.getBuyerCart(req.session.userid).then(prods =>{
    var totalPrice = 0;
    Array.prototype.forEach.call(prods, function(product) {
      var price = product.price*product.quantity;
      totalPrice = totalPrice + price;
    });
    res.render('cart', { title: 'IGITIENDA', username: req.session.username, userid: req.session.userid, prods: prods, totalPrice: totalPrice});
  });
});

/* buyerHome */
router.post('/getProductQuantity', function(req, res, next) {
  const body = req.body.productId;
  if(!req.session.username){
		return res.redirect('/users/login');
  }
  DB.getProductQuantity(body).then(quant =>{
    console.log("Cantidad: ");
    console.log(quant);
    return res.send({quantity: quant.stock});
  });
});

/* buyerHome */
router.post('/modifyProductUnits', function(req, res, next) {
  const body = req.body;
  const buyerId = req.session.userid;
  if(!req.session.username){
		return res.redirect('/users/login');
  }
  DB.modifyProductUnits(body, buyerId).then(result =>{
    if(result != 1){
      return res.send({status: -1});
    }
    return res.send({status: 1});
  });
});

router.get('/payment', function(req, res, next) {
  if(!req.session.username){
		return res.redirect('/users/login');
  }
  DB.getBuyerCart(req.session.userid).then(prods =>{
    var totalPrice = 0;
    Array.prototype.forEach.call(prods, function(product) {
      var price = product.price*product.quantity;
      totalPrice = totalPrice + price;
    });
    DB.getPaymentMethod(req.session.userid).then(methods =>{
      DB.getBuyerDirection(req.session.userid).then(directions =>{
        res.render('Pagar', { 
          title: 'IGITIENDA', 
          username: req.session.username, 
          userid: req.session.userid, 
          prods: prods, 
          totalPrice: totalPrice, 
          methods: methods, 
          directions: directions
        });
      });  
    });
  });
});

router.post('/payCart',(req,res)=>{
  //getting the body of the request
  const body = req.body;
  const buyerId = req.session.userid;
  //console.log("Im hereeeeee in payCart");
  console.log(body);
  console.log(buyerId);
  DB.payCart(body, buyerId).then(regProd=>{
    DB.getProductQuantity(body.productId).then(stock=>{
      DB.modifyProductStock(body, stock).then(modifyProdStock=>{
        DB.deleteProductFromCart(body.productId, buyerId).then(deleteProdInCar=>{
          DB.getStoreIdByProductId(body.productId).then(store=>{
            var storeId = store;
            console.log("StoreId: ");
            console.log(storeId.storeId);
            DB.addingProductToSalesRecord(body, storeId.storeId).then(salesRecord=>{
              if(salesRecord == 1){
                return res.send({status: 1, message: "Producto comprado con éxito"});
              }
              return res.send({status: -1, message: "Algo salió mal, intente de nuevo"});
            });
          });
        }); 
      }); 
    });
    //return res.send({status: -1, message: "Algo salió mal, intente de nuevo"});
  });
});


router.get('/Product/:id', function(req, res, next) {
  if(!req.session.username){
		return res.redirect('/users/login');
  }
  const body = req.params.id;
  //console.log("Product id: ");
  //console.log(body);
  DB.getProductbyId(body).then(selectProd=>{
    console.log("selectProd: ");
    console.log(selectProd);
    res.render('Producto', { title: 'IGITIENDA', username: req.session.username, userid: req.session.userid, prodSelect: selectProd});
  });
});

router.get('/ModifyProduct/:id', function(req, res, next) {
  if(!req.session.username){
		return res.redirect('/users/login');
  }
  const productId = req.params.id;
  //console.log("Product id: ");
  //console.log(body);
  DB.getProductbyId(productId).then(selectProd=>{
    console.log("selectProd: ");
    console.log(selectProd);
    res.render('store/modifyProduct', { title: 'IGITIENDA', username: req.session.username, userid: req.session.userid, product: selectProd, productId: productId});
  });
});



router.get('/sellerStoreProducts/:id', function(req, res, next) {
  if(!req.session.username){
		return res.redirect('/users/login');
  }
  const storeId = req.params.id;
  //console.log("Product id: ");
  //console.log(body);
  DB.getProductsbyStoreId(storeId).then(prods=>{
    console.log("Products");
    console.log(prods);
    res.render('store/storeProducts', { title: 'Ecastore', username: req.session.username, userid: req.session.userid, products: prods, type: 0});
  });
});

router.get('/OtherSellersStoreProducts/:id', function(req, res, next) {
  if(!req.session.username){
		return res.redirect('/users/login');
  }
  const storeId = req.params.id;
  //console.log("Product id: ");
  //console.log(body);
  DB.getProductsbyStoreId(storeId).then(prods=>{
    console.log("Products");
    console.log(prods);
    res.render('store/storeProducts', { title: 'Ecastore', username: req.session.username, userid: req.session.userid, products: prods, type: 2});
  });
});

router.get('/buyerStoreProducts/:id', function(req, res, next) {
  if(!req.session.username){
		return res.redirect('/users/login');
  }
  const storeId = req.params.id;
  //console.log("Product id: ");
  //console.log(body);
  DB.getProductsbyStoreId(storeId).then(prods=>{
    console.log("Products");
    console.log(prods);
    res.render('store/storeProducts', { title: 'Ecastore', username: req.session.username, userid: req.session.userid, products: prods, type: 1});
  });
});

/*

*/
//sellerProducts

router.get('/sellerProducts', function(req, res, next) {
  if(!req.session.username){
		return res.redirect('/users/login');
  }
  var products = [];
  //console.log("Nombre: " + req.session.username);
  DB.getProducts().then(prods =>{
    console.log("Productos");
    console.log(prods);
    res.render('seller/sellerProducts', { title: 'IGITIENDA', username: req.session.username, userid: req.session.userid, products: products, prods: prods });
  });
});

router.get('/sellerProfile', function(req, res, next) {
  res.render('seller/sellerProfile',{ title: 'IGITIENDA', username: req.session.username, userid: req.session.userid });
});

router.get('/sellerStores', function(req, res, next) {
  DB.getStoresBySellerId(req.session.userid).then(stores =>{
    console.log("Negocios");
    console.log(stores);
    res.render('seller/sellerStores',{ 
      title: 'EcaStore', 
      username: req.session.username,
      userid: req.session.userid, 
      stores: stores
    });
  })
});


router.get('/buyerProfile', function(req, res, next) {
  DB.getPaymentMethod(req.session.userid).then(methods =>{
    DB.getBuyerDirection(req.session.userid).then(directions =>{
      DB.getBuyerById(req.session.userid).then(user =>{
        res.render('buyer/buyerProfile', { 
          title: 'IGITIENDA', 
          username: req.session.username, 
          userid: req.session.userid,  
          methods: methods, 
          directions: directions,
          user: user
        });
      }); 
    });  
  });
});

router.get('/buyerPayment', function(req, res, next) {
  res.render('buyer/buyerPayment',{ title: 'IGITIENDA', username: req.session.username, userid: req.session.userid });
});

router.get('/HistorialCompras', function(req, res, next) {
  if(!req.session.username){
		return res.redirect('/users/login');
  }
  var products = [];
  //console.log("Nombre: " + req.session.username);
  DB.getHistorial(req.session.userid).then(prods =>{
    console.log("Productos");
    console.log(prods);
    res.render('HistorialCompras', { title: 'IGITIENDA', username: req.session.username, userid: req.session.userid, products: prods });
  }); 
});

router.get('/salesRecord/:id', function(req, res, next) {
  if(!req.session.username){
		return res.redirect('/users/login');
  }
  const body = req.params.id;
  //console.log("Nombre: " + req.session.username);
  DB.getSalesRecord(body).then(products =>{
    console.log("Ventas: ");
    console.log(products);
    res.render('storeSalesRecord', { title: 'EcaStore', username: req.session.username, userid: req.session.userid, products: products });
  }); 
});

module.exports = router;
