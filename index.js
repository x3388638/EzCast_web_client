const CONFIG = require('./config.js');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

app.use(express.static('web'));

http.listen(CONFIG.webPort, function(){
	console.log('listening on 127.0.0.1:' + CONFIG.webPort);
});
