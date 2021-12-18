var mysql = require('mysql');

var pool  = mysql.createPool({
    host     : 'localhost',
    user     : 'digiUser',
    password : 'digitienda',
    database : 'Digitienda'
});

exports.pool = pool;