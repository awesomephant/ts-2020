import io from  'socket.io-client';

const socket = io();

function subscribeToUsers(cb) {
    socket.on('users', (data) => {
        cb(null, data)
    })
}

function emitPosition(pos) {
    socket.emit('mouse position', pos)
}


export { subscribeToUsers, emitPosition }