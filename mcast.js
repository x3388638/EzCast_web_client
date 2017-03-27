const CONFIG = require('./config.js');
var os = require('os');
var dgram = require('dgram');
var serverSocket = dgram.createSocket("udp4");
var SRC_PORT = CONFIG.udpPort;
var DES_PORT = +SRC_PORT+1;
var MULTICAST_ADDR = CONFIG.multicastAddr;
var LOCAL_INTERFACES = [];

/**
 * get local interfaces ip
 */
var interfaces = os.networkInterfaces();
for (var k in interfaces) {
    for (var k2 in interfaces[k]) {
        var address = interfaces[k][k2];
        if (address.family === 'IPv4' && !address.internal) {
            LOCAL_INTERFACES.push(address.address);
        }
    }
}

serverSocket.bind(SRC_PORT);

serverSocket.on('listening', function () {
	console.log(`udp server built on port ${SRC_PORT}`);
	for(let ip of LOCAL_INTERFACES) {
		serverSocket.addMembership(MULTICAST_ADDR, ip);
	}
	var address = serverSocket.address();
	console.log('UDP Client listening on ' + address.address + ":" + address.port);
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

/**
 * handle receive multicast message
 */
serverSocket.on('message', function (message, rinfo) {
	var remoteAddr = rinfo.address;
	try {
		var msg = JSON.parse(message);
	} catch(err) {
		console.log(err);
	}
	if(!msg) {
		return;
	}
	switch(msg.event) {
		case 'register':
			console.log(`===== server ip: ${remoteAddr} =====`);
			if(msg.data.key == _registerKey) {
				_registerCallback(remoteAddr, msg.data.ip);
			}
			break;
	}
});

module.exports = {
	register
}
