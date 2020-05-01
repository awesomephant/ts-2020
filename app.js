var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var router = express.Router();

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/client/public')));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '/client/public/index.html'))
})

module.exports = app;
