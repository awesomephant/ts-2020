const express = require('express');
const enforce = require('express-sslify');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const CLIENT_ID = "431294902057-8pcjs5j7qb6ija5a2680djplnp6ied7f.apps.googleusercontent.com"
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);
const socketApi = require('./socketAPI.js');
const db = require('./db')

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,
    });
    return ticket.getPayload();

}

var app = express();

console.log(app.get("env"))
if (app.get("env") === "production") {
    app.use(enforce.HTTPS({ trustProtoHeader: true }))
}

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.json());
app.use(express.static(path.join(__dirname, '/client/_site/')));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '/client/_site/index.html'))
})

app.post('/api/authenticate/', function (req, res) {
    let data = req.body
    verify(data.token).catch(console.error).then((payload) => {
        global.users[data.socketID].auth = true;
        global.users[data.socketID].given_name = payload.given_name;
        socketApi.io.emit('users', global.users)
        res.send({ status: "success" })
    });

})

app.get('/api/comments/', function (req, res) {
    let q;
    q = `SELECT * FROM comments
         ORDER BY created DESC`
    db.query(q, [], (err, data) => {
        if (err) {
            console.log(err)
            res.send({ status: "failed" })
        } else {
            res.send({ status: "sucess", data: data.rows })
        }
    })

})


module.exports = app;
