const CONFIG = require('./config.js');
var dgram = require('dgram');
var serverSocket = dgram.createSocket("udp4");
var SRC_PORT = CONFIG.udpPort;
var DES_PORT = +SRC_PORT+1;
var MULTICAST_ADDR = CONFIG.multicastAddr;

serverSocket.bind(SRC_PORT, function () {
	console.log('udp server built');
});

function connectToServer() {
	var message = new Buffer('connectToServer');
	serverSocket.send(message, DES_PORT, MULTICAST_ADDR, function () {
		console.log("Sent multicast '" + message + "'");
	});
}

module.exports = {
	connectToServer
}
