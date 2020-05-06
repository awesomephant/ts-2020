var socket_io = require('socket.io');
var io = socket_io();
var socketApi = {};

socketApi.io = io;

io.on('connection', (socket) => {
    console.log(`User ${socket.id} connected.`);
    global.users[socket.id] = { id: socket.id, position: { x: 0, y: 0 } }
    io.emit('users', global.users)

    socket.on('mouse position', (pos) => {
        global.users[socket.id].position = pos;
        io.emit('users', global.users)
    })
    socket.on('disconnect', () => {
        delete global.users[socket.id]
        io.emit('users', global.users)
        console.log(`User ${socket.id} disconnected`);
    });
});

module.exports = socketApi;