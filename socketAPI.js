const socket_io = require('socket.io');
const io = socket_io();
const socketApi = {};
const db = require('./db')

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

    socket.on('comment', (comment) => {
        if (global.users[comment.author.id].auth === true) {
            // emit event (for real time)
            socket.emit('comment', comment)

            // write to database
            const q = "INSERT INTO comments(text, author, project) VALUES($1, $2, $3)"
            db.query(q, [comment.text, comment.author, 0], (err, res) => {
                if (err) { return err }
                console.log('Saved comment.')
            })
        } else {
            return false;
        };
    })

    socket.on('disconnect', () => {
        delete global.users[socket.id]
        io.emit('users', global.users)
        console.log(`User ${socket.id} disconnected`);
    });
});

module.exports = socketApi;