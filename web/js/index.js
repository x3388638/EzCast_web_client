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
	var _socketServer = null;
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
	function _bindServerSocket() {
		_socketServer.on('message', _handleOnMessage);
	}
	
	function _handleSendMsg(e) {
		if(e.keyCode == 13) {
			if(_socketServer == null) {
				return;
			}
			var msg = $inputMsg.val().trim();
			$inputMsg.val('');
			_socketServer.emit('message', JSON.stringify({
				event: 'newMessage', 
				data: {
					msg
				}
			}));
		}
	}

	function _handleOnRegister(msg) {
		console.log(`===== receive from local server: ${msg} =====`);
		msg = JSON.parse(msg);
		if(msg.data.register) {
			console.log('register success.');
			clearInterval(_registerInterval);
			_socketServer = io.connect(msg.data.url);
			_bindServerSocket();
			_selfIP = msg.data.ip;
			$inputName.text(`${_selfIP} > `);
		} else {
			console.log('register fail.')
		}
	}

	function _handleOnMessage(data) {
		data = JSON.parse(data);
		console.log(data);
		switch(data.event) {
			case 'newMessage': 
				_renderNewMessage(data.data.msg, data.data.ip);
				break;
		}
	}

	function _renderNewMessage(msg, ip) {
		$chatContainer.append(
			`<div class="msgRow">
				<span class="title">${ip}</span>
				<span class="content">${msg}</span>
			</div>`
		);
	}

})();
