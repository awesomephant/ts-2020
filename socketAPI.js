var socket_io = require('socket.io');
var io = socket_io();
var socketApi = {};

socketApi.io = io;

io.on('connection', (socket) => {
    console.log(`User ${socket.id} connected.`);
    global.users[socket.id] = { id: socket.id, auth: false }
    io.emit('users', global.users)

    socket.on('mouse position', (pos) => {
        global.users[socket.id].position = pos;
        io.emit('users', global.users)
    })

    socket.on('signout', (id) => {
        global.users[id].auth = false;
        global.users[id].given_name = "";
        io.emit('users', global.users)
    })

    socket.on('disconnect', () => {
        delete global.users[socket.id]
        io.emit('users', global.users)
        console.log(`User ${socket.id} disconnected`);
    });
});

module.exports = socketApi;