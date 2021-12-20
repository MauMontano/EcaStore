var mysql = require('mysql');

var pool  = mysql.createPool({
    host     : 'localhost',
    user     : 'ecaUser',
    password : 'ecaStore',
    database : 'EcaStore'
});

exports.pool = pool;