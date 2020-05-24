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
        if (global.users[comment.author.id].auth === true && comment.text.length > 2) {
            // emit event (for real time)
            io.emit('comment', comment)
            
            // write to database
            const q = "INSERT INTO comments(text, author, project) VALUES($1, $2, $3)"
            db.query(q, [comment.text, comment.author, parseInt(comment.project)], (err, res) => {
                if (err) { console.warn(err) }
                console.log('Saved comment.')
            })
        } else {
            io.emit('error', "Couldn't save comment: User is not authenticated.")
        };
    })

    socket.on('disconnect', () => {
        delete global.users[socket.id]
        io.emit('users', global.users)
        console.log(`User ${socket.id} disconnected`);
    });
});

module.exports = socketApi;