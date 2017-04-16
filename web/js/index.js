var App = (_ => {

	/**
	 * init
	 */
	var _APITarget = null;
	var _socket = io();
	var _registerInterval = 0;
	var _selfIP = null;
	var _userName = localStorage.EzCastUser || '';
	var _isNotification = null;
	_registerInterval = setInterval(function() {
		_socket.emit('register', JSON.stringify({name: _userName}));
	}, 2000);

	_setNotification();
	
	/**
	 * ws event
	 */
	_socket.on('register', _handleOnRegister);
	_socket.on('message', _handleOnMessage);
	_socket.on('disconnect', function () {
        console.error("ws disconnected");  
    });

	function _handleOnRegister(msg) {
		// console.log(`===== receive from local server: ${msg} =====`);
		msg = JSON.parse(msg);
		if(msg.data.register) {
			console.log('register success.');
			clearInterval(_registerInterval);
			_APITarget = msg.data.url;
			_selfIP = msg.data.ip;
			_userName = msg.data.name;
			ChatInput.setUser(_userName);
			ChatScreen.getHistoryMsg();
		} else {
			console.log('register fail.');
		}
	}

	function _handleOnMessage(data) {
		data = JSON.parse(data);
		// console.log(`===== receive msg from ${data.data.ip} =====`);
		switch(data.event) {
			case 'newMessage': 
				ChatScreen.renderMsg('current', {
					msg: data.data.msg, 
					ip: data.data.ip, 
					name: data.data.name, 
					time: data.data.time, 
					admin: data.data.admin
				});
				break;
		}
	}

	function _setNotification() {
		if ("Notification" in window) {
			_isNotification = Notification.permission;
			if (Notification.permission == 'default') {
				Notification.requestPermission(function (permission) {
					_isNotification = permission;
				});
			}
		}
	}
	
	function getAPITarget() {
		return _APITarget;
	}

	function getNotificationPermission() {
		return _isNotification;
	}

	return {
		getAPITarget, 
		getNotificationPermission
	}

})();
