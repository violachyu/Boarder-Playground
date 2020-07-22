require('dotenv').config();
const mysql = require('mysql');
const env = process.env.NODE_ENV || 'local';
const { promisify } = require('util'); // util from native nodejs library
const { MYSQL_HOST, MYSQL_USERNAME, MYSQL_PASSWORD, MYSQL_DATABASE } = process.env;
const { RDS_HOST, RDS_USERNAME, RDS_PASSWORD, RDS_DATABASE } = process.env;

const mysqlConfig = {
    local: {
        // for localhost
        host: MYSQL_HOST,
        user: MYSQL_USERNAME,
        password: MYSQL_PASSWORD,
        database: MYSQL_DATABASE
    },
    RDS: {
        // for RDS
        host: RDS_HOST,
        user: RDS_USERNAME,
        password: RDS_PASSWORD,
        database: RDS_DATABASE
    }

};

const mysqlCon = mysql.createConnection(mysqlConfig[env]);

const promiseQuery = promisify(mysqlCon.query).bind(mysqlCon);
const promiseTransaction = promisify(mysqlCon.beginTransaction).bind(mysqlCon);
const promiseCommit = promisify(mysqlCon.commit).bind(mysqlCon);
const promiseRollback = promisify(mysqlCon.rollback).bind(mysqlCon);
const promiseEnd = promisify(mysqlCon.end).bind(mysqlCon);

// // Use pool to reuse connections
// const pool = mysql.createPool({
//     connectionLimit: 10, // default 10
//     host: process.env.RDS_HOST,
//     user: process.env.RDS_USERNAME,
//     password: process.env.RDS_PASSWORD,
//     database: process.env.RDS_DATABASE
// });
// let promiseQuery;
// let promiseTransaction;
// let promiseCommit;
// let promiseRollback;
// let promiseEnd;

// pool.getConnection(function (err, connection) {
//     if (err) throw err; // not connected!
//     console.log(`MySQL pool connected at ${process.env.MYSQL_HOST}!`);
//     promiseQuery = promisify(connection.query).bind(connection);
//     promiseTransaction = promisify(connection.beginTransaction).bind(connection);
//     promiseCommit = promisify(connection.commit).bind(connection);
//     promiseRollback = promisify(connection.rollback).bind(connection);
//     promiseEnd = promisify(connection.end).bind(connection);
// });

module.exports = {
    core: mysql,
    query: promiseQuery,
    transaction: promiseTransaction,
    commit: promiseCommit,
    rollback: promiseRollback,
    end: promiseEnd,
};
