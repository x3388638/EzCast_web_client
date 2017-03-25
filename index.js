const CONFIG = require('./config.js');
var mcast = require('./mcast.js')
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var cors = require('cors');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
app.use(express.static('web'));

let _serverIP;
let _socket;
io.on('connection', function(socket){
	console.log('client connected');
	_socket = socket;
	
	/**
	 * send multicast to fin server
	 */
	socket.on('register', function() {
		mcast.register(function(url, selfIP) {
			_serverIP = url;
			socket.emit('register', JSON.stringify({
				data: {
					register: true, 
					url: `http://${url}:${+CONFIG.webPort+1}`, 
					ip: selfIP
				}
			}));
		});
	});

	socket.on('disconnect', function(){
		console.log('user disconnected');
	});
});

/**
 * API handler
 */
app.post('/message', cors(), function(req, res) {
	let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	ip = ip.replace('::ffff:', '');
	if(ip != _serverIP) {
		console.log(`===== Someone not server ${ip} call the api =====`);
		res.send('access denied');
		return;
	}

	_socket.emit('message', JSON.stringify({
		event: 'newMessage', 
		data: {
			msg: req.body.msg, 
			ip: req.body.ip
		}
	}));

	res.json({
		err: 0
	});
});

http.listen(CONFIG.webPort, function(){
	console.log('listening on 127.0.0.1:' + CONFIG.webPort);
});
