const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const CLIENT_ID = "431294902057-8pcjs5j7qb6ija5a2680djplnp6ied7f.apps.googleusercontent.com"
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);
const socketApi = require('./socketApi');

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,
    });
    return ticket.getPayload();

}

var app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.json());
app.use(express.static(path.join(__dirname, '/client/public/')));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '/client/public/index.html'))
})

app.post('/api/authenticate/', function (req, res) {
    let data = req.body
    verify(data.token).catch(console.error).then((payload) => {
        global.users[data.socketID].auth = true;
        global.users[data.socketID].given_name = payload.given_name;
        socketApi.io.emit('users', global.users)
    });

})


module.exports = app;
