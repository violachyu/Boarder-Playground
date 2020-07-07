require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT;
const API_VERSION = process.env.API_VERSION;
const path = require('path');

// static files
app.use(express.static('public'));

/*---Parser---*/
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const cookieParser = require('cookie-parser');
app.use(cookieParser());

// CORS Control
app.use('/api/', function (req, res, next) {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept, Authorization');
    res.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.set('Access-Control-Allow-Credentials', 'true');
    next();
});

// API routes
app.use('/api/' + API_VERSION,
    [
        require('./server/route/user_route'),
        require('./server/route/dashboard_route')
        // require('./server/route/workspace_route')
    ]
);

// Page not found
app.use(function (req, res, next) {
    res.status(404).sendFile(__dirname + '/public/404.html');
});

// Error handling
app.use(function (err, req, res, next) {
    console.log(err);
    res.status(500).send('Internal Server Error');
});


// // Test
// const mysql = require('mysql');
// const { query } = require('./util/con');
// app.get('/test_query', (req, res) => {
//     let test_sql = `SELECT * FROM wb;`
//     query(test_sql, (result, error, fields) => {
//         console.log(result);
//     })
// })


app.listen(PORT, () => {
    console.log(`Boarder Playground connected to port ${PORT}`)
})

module.exports = app;