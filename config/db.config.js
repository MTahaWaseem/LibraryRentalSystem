
const mysql = require('mysql');

const connectionString = {
    connectionLimit : 100,
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'web_db',
    debug : false,
    port : 3306
};

const db = mysql.createPool(connectionString);

module.exports = {
   db
};