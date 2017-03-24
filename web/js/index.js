var App = (_ => {
	/**
	 * cache dom
	 */
	var $chatContainer = $('#chatContainer');
	var $inputContainer = $('#inputContainer');
	var $inputName = $inputContainer.find('#name');
	var $inputMsg = $inputContainer.find('#inputMsg');

	/**
	 * init
	 */
	var _socketTarget = null;
	var _socket = io();
	var _registerInterval = 0;
	var _selfIP = null;
	$inputMsg.focus();
	_registerInterval = setInterval(function() {
		_socket.emit('register', '');
	}, 2000);

	/**
	 * bindEvent
	 */
	$inputMsg.on('keypress', _handleSendMsg);
	
	/**
	 * ws event
	 */
	_socket.on('register', _handleOnRegister);
	
	function _handleSendMsg(e) {
		if(e.keyCode == 13) {
			var msg = $inputMsg.val().trim();
			console.log(msg);
			$inputMsg.val('');
		}
	}

	function _handleOnRegister(msg) {
		msg = JSON.parse(msg);
		console.log(msg);
		if(msg.data.register) {
			console.log('register success.');
			clearInterval(_registerInterval);
			_socketTarget = msg.data.url;
			_selfIP = msg.data.ip;
			// TODO: build ws with _socketTarget
			$inputName.text(`${_selfIP} > `);
		} else {
			console.log('register fail.')
		}
	}

})();
