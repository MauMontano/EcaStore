var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'IGITIENDA' });
});


router.get('/saldo', function(req, res, next) {
  res.render('saldo', { title: 'IGITIENDA' });
});
router.get('/Retiro', function(req, res, next) {
  res.render('Retiro', { title: 'IGITIENDA' });
});
router.get('/TarjetaC', function(req, res, next) {
  res.render('TarjetaC', { title: 'IGITIENDA' });
});

router.get('/MetodoG', function(req, res, next) {
  res.render('MetodoG', { title: 'IGITIENDA' });
});

router.get('/MetodoE', function(req, res, next) {
  res.render('MetodoE', { title: 'IGITIENDA' });
});

router.get('/abonar',function(req,res,next){
res.render('abonar',{ title: 'IGITIENDA'});
});

router.get('/Deposito',function(req,res,next){
  res.render('Deposito',{ title: 'IGITIENDA'});
});


router.get('/retirar', function(req, res, next) {
  res.render('retirar', { title: 'IGITIENDA' });
});

router.get('/metodo',function(req,res,next){
  res.render('metodo',{ title: 'IGITIENDA'});
});
  

router.get('/borrarM', function(req, res, next) {
  res.render('borrarM', { title: 'IGITIENDA' });
});

router.get('/NTarjeta', function(req, res, next) {
    res.render('NTarjeta', { title: 'IGITIENDA' });
});

router.get('/busqueda1', function(req, res, next) {
  res.render('busqueda1', { title: 'IGITIENDA' });
});

router.get('/Producto', function(req, res, next) {
  res.render('Producto', { title: 'IGITIENDA' });
});
 
router.get('/CalifProduc', function(req, res, next) {
    res.render('CalifProduc', { title: 'IGITIENDA' });
});





module.exports = router;

