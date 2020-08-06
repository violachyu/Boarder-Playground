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
    user_join,
    get_current_user,
    user_leave,
    get_room_users,
    get_user_count
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
    socket.emit('message', 'Welcome to Boarder Playground!');

    // Join room
    socket.on('join_room', function ({ user_id, username, user_color, wb_id, wb_name }) {
        // organize user object
        let user = user_join(socket.id, user_id, username, user_color, wb_id, wb_name);

        socket.join(user.wb_id);

        // Welcome current user
        socket.emit('status_message', 'Welcome to Boarder Playground!');

        // Broadcast when a user connects
        socket.broadcast.to(user.wb_id)
            .emit(
                'status_message',
                `${user.username} has joined the room`
            );

        // Send users and room info
        io.to(user.wb_id)
            .emit('room_users', {
                room: user.wb_id,
                room_name: user.wb_name,
                users: get_room_users(user.wb_id),
                user_count: get_user_count(),
            });

        // Sync on add postit
        socket.on('add_postit', function (postit_id) {
            socket.to(user.wb_id).emit('add_render', postit_id);
        });

        // Sync on edit postit
        socket.on('edit_postit', function (postit_item) {
            socket.to(user.wb_id).emit('edit_render', postit_item);
        });

        // Sync on delete postit
        socket.on('delete_postit', function (delete_id) {
            socket.to(user.wb_id).emit('delete_render', delete_id);
        });
        // Lock postit
        socket.on('lock', function (id) {
            let current_user = get_current_user(user.user_id);
            socket.to(user.wb_id).emit('lock_render', id, current_user);
        });
        // remove cover after editing 
        socket.on('lock_remove', function (id) {
            socket.to(user.wb_id).emit('lock_remove_render', id);
        });
        // Sync template
        socket.on('template', function (template) {
            io.to(user.wb_id).emit('template_render', template);
        });

    });

    // Runs when client disconnects
    socket.on('disconnect', function () {
        let new_user_list = user_leave(socket.id);

        if (new_user_list && new_user_list.user_left) {
            io.to(new_user_list.user_left.wb_id).emit(
                'status_message',
                `${new_user_list.user_left.username} has left this whiteboard`
            );

            // Send users and room info
            io.to(new_user_list.user_left.wb_id).emit('room_users', {
                room: new_user_list.user_left.wb_id,
                room_name: new_user_list.user_left.wb_name,
                users: get_room_users(new_user_list.user_left.wb_id),
                user_count: get_user_count(),
            });
        }
    });

});

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
    console.log(`Boarder Playground connected to port ${PORT}`);
});

module.exports = app;