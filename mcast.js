const CONFIG = require('./config.js');
var dgram = require('dgram');
var serverSocket = dgram.createSocket("udp4");
var SRC_PORT = CONFIG.udpPort;
var DES_PORT = +SRC_PORT+1;
var MULTICAST_ADDR = CONFIG.multicastAddr;

serverSocket.bind(SRC_PORT, function () {
	console.log(`udp server built on port ${SRC_PORT}`);
	serverSocket.addMembership(MULTICAST_ADDR);
});

/**
 * send multicast to find server
 */
let _registerKey = null;
let _registerCallback = null;
function register(callback) {
	_registerCallback = callback;
	_registerKey = Math.random().toString(36).substring(7);
	msg = JSON.stringify({
		event: 'register', 
		data: {
			key: _registerKey
		}
	});
	serverSocket.send(new Buffer(msg), DES_PORT, MULTICAST_ADDR, function () {
		console.log(`Send multicast to port ${DES_PORT} ::: ${msg}`);
	});
}

serverSocket.on('listening', function () {
	var address = serverSocket.address();
	console.log('UDP Client listening on ' + address.address + ":" + address.port);
});

/**
 * handle receive multicast message
 */
serverSocket.on('message', function (message, rinfo) {
	var remoteAddr = rinfo.address;
	var msg = JSON.parse(message);
	switch(msg.event) {
		case 'register':
			if(msg.data.key == _registerKey) {
				_registerCallback(remoteAddr, msg.data.ip);
			}
			break;
	}
});

module.exports = {
	register
}
