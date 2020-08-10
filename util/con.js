require('dotenv').config();
const mysql = require('mysql');
const env = process.env.NODE_ENV || 'local';
const { promisify } = require('util'); // util from native nodejs library
const { MYSQL_HOST, MYSQL_USERNAME, MYSQL_PASSWORD, MYSQL_DATABASE } = process.env;
const { RDS_HOST, RDS_USERNAME, RDS_PASSWORD, RDS_DATABASE, TEST_DATABASE } = process.env;

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
    },
    test: {
        // for testing environment
        host: MYSQL_HOST,
        user: MYSQL_USERNAME,
        password: MYSQL_PASSWORD,
        database: TEST_DATABASE
    }

};

const mysqlCon = mysql.createConnection(mysqlConfig[env]);

const promiseQuery = promisify(mysqlCon.query).bind(mysqlCon);
const promiseTransaction = promisify(mysqlCon.beginTransaction).bind(mysqlCon);
const promiseCommit = promisify(mysqlCon.commit).bind(mysqlCon);
const promiseRollback = promisify(mysqlCon.rollback).bind(mysqlCon);
const promiseEnd = promisify(mysqlCon.end).bind(mysqlCon);



module.exports = {
    core: mysql,
    query: promiseQuery,
    transaction: promiseTransaction,
    commit: promiseCommit,
    rollback: promiseRollback,
    end: promiseEnd,
};
