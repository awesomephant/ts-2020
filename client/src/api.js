import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:4000');

function subscribeToUsers(cb) {
    socket.on('users', (data) => {
        cb(null, data)
    })
}

function emitPosition(pos) {
    socket.emit('mouse position', pos)
}


export { subscribeToUsers, emitPosition }