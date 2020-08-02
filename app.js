require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT;
const API_VERSION = process.env.API_VERSION;
const path = require('path');
const socketio = require('socket.io');
const http = require('http');
const server = http.createServer(app);
const io = socketio(server);

// static files
app.use(express.static('public'));

// socket utils library
const {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers,
    getUserCount
} = require('./util/users');

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
        require('./server/route/dashboard_route'),
        require('./server/route/workspace_route')
    ]
);

// Socket Server
io.on('connection', socket => {
    // check connection
    socket.emit('message', 'Welcome to Boarder Playground!')

    // Join room
    socket.on('joinRoom', function ({ user_id, username, userColor, wb_id, wb_name }) {
        // organize user object
        let user = userJoin(socket.id, user_id, username, userColor, wb_id, wb_name);

        socket.join(user.wb_id);

        // Welcome current user
        socket.emit('statusMessage', 'Welcome to Boarder Playground!');

        // Broadcast when a user connects
        socket.broadcast.to(user.wb_id)
            .emit(
                'statusMessage',
                `${user.username} has joined the room`
            );

        // Send users and room info
        io.to(user.wb_id)
            .emit('roomUsers', {
                room: user.wb_id,
                room_name: user.wb_name,
                users: getRoomUsers(user.wb_id),
                user_count: getUserCount(),
            });

        // Sync on add postit
        socket.on('addPostit', function (postit_id) {
            socket.to(user.wb_id).emit('addRender', postit_id)
        })

        // Sync on edit postit
        socket.on('editPostit', function (postit_item) {
            socket.to(user.wb_id).emit('editRender', postit_item)
        })

        // Sync on delete postit
        socket.on('deletePostit', function (deleteId) {
            socket.to(user.wb_id).emit('deleteRender', deleteId)
        })
        // Lock postit
        socket.on('lock', function (id) {
            let currentUser = getCurrentUser(user.user_id);
            socket.to(user.wb_id).emit('lockRender', id, currentUser)
        })
        // remove cover after editing 
        socket.on('lockRemove', function (id) {
            socket.to(user.wb_id).emit('lockRemoveRender', id);
        })
        // Sync template
        socket.on('template', function (template) {
            io.to(user.wb_id).emit('templateRender', template)
        })

    })

    // Runs when client disconnects
    socket.on('disconnect', function () {
        let newUserList = userLeave(socket.id);

        if (newUserList && newUserList.userLeft) {
            console.log('socketfix', newUserList)
            io.to(newUserList.userLeft.wb_id).emit(
                'statusMessage',
                `${newUserList.userLeft.username} has left this whiteboard`
            );

            // Send users and room info
            io.to(newUserList.userLeft.wb_id).emit('roomUsers', {
                room: newUserList.userLeft.wb_id,
                room_name: newUserList.userLeft.wb_name,
                users: getRoomUsers(newUserList.userLeft.wb_id),
                user_count: getUserCount(),
            });
        }
    });

})

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


server.listen(PORT, () => {
    console.log(`Boarder Playground connected to port ${PORT}`)
})

module.exports = app;