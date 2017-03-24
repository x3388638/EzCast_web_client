const CONFIG = require('./config.js');
var mcast = require('./mcast.js')
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

app.use(express.static('web'));

io.on('connection', function(socket){
	console.log('a user connected, IP: ' + socket.request.connection.remoteAddress);
	
	/**
	 * send multicast to fin server
	 */
	socket.on('register', function() {
		mcast.register(function(url) {
			socket.emit('register', JSON.stringify({
				data: {
					register: true, 
					url: `http://${url}:${+CONFIG.webPort+1}/`
				}
			}));
		});
	});

	socket.on('disconnect', function(){
		console.log('user disconnected');
	});
});

http.listen(CONFIG.webPort, function(){
	console.log('listening on 127.0.0.1:' + CONFIG.webPort);
});
