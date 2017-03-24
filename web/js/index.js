var App = (_ => {
	/**
	 * cache dom
	 */
	var $chatContainer = $('#chatContainer');
	var $inputContainer = $('#inputContainer');
	var $inputMsg = $inputContainer.find('#inputMsg');

	/**
	 * init
	 */
	var _socketTarget = null;
	var _socket = io();
	var _registerInterval = 0;
	$inputMsg.focus();
	// TODO: get my ip
	// TODO: set interval to send multicast to find server
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
	_socket.on('register', function(msg) {
		msg = JSON.parse(msg);
		if(msg.data.register) {
			console.log('register success');
			console.log(msg);
			_socketTarget = msg.data.url;
			clearInterval(_registerInterval)
		}
	});

	function _handleSendMsg(e) {
		if(e.keyCode == 13) {
			var msg = $inputMsg.val().trim();
			console.log(msg);
			$inputMsg.val('');
		}
	}

})();
