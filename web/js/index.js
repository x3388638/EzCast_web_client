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
	var _APITarget = null;
	var _socket = io();
	var _registerInterval = 0;
	var _selfIP = null;
	var _autoScroll = true;
	var _userName = localStorage.EzCastUser || '';
	$inputMsg.focus();
	_registerInterval = setInterval(function() {
		_socket.emit('register', JSON.stringify({name: _userName}));
	}, 2000);

	/**
	 * bindEvent
	 */
	$inputMsg.on('keypress', _handleSendMsg);
	$chatContainer.on('scroll', _handleScroll);
	
	/**
	 * ws event
	 */
	_socket.on('register', _handleOnRegister);
	_socket.on('message', _handleOnMessage);

	
	function _handleSendMsg(e) {
		if(e.keyCode == 13) {
			if(_APITarget == null) {
				return;
			}
			var msg = $inputMsg.val().trim();
			$inputMsg.val('');
			$.ajax({
				url: `${_APITarget}/message`, 
				type: 'post', 
				dataType: 'json', 
				data: {
					msg
				}, 
				success: function(data) {
					// console.log(data);
				}, 
				error: function(jqXHR) {
					console.log(jqXHR);
				}
			});
		}
	}

	function _handleOnRegister(msg) {
		console.log(`===== receive from local server: ${msg} =====`);
		msg = JSON.parse(msg);
		if(msg.data.register) {
			console.log('register success.');
			clearInterval(_registerInterval);
			_APITarget = msg.data.url;
			_selfIP = msg.data.ip;
			$inputName.text(_selfIP);
		} else {
			console.log('register fail.');
		}
	}

	function _handleOnMessage(data) {
		data = JSON.parse(data);
		console.log(`===== receive msg from ${data.data.ip} =====`);
		switch(data.event) {
			case 'newMessage': 
				_renderNewMessage(data.data.msg, data.data.ip, data.data.name);
				break;
		}
	}

	function _handleScroll() {
		if(_isScrollBottom()) {
			_autoScroll = true;
		} else {
			_autoScroll = false;
		}
	}

	function _renderNewMessage(msg, ip, name) {
		$chatContainer.append(
			`<div class="msgRow">
				<div class="title">
					<span class="name">${name}</span><br />
					<span class="ip">${ip}</span>
				</div>
				<div class="content">${msg}</div>
			</div>`
		);
		if(_autoScroll) {
			_scrollToBottom();
		}
	}

	function _isScrollBottom() {
		return $chatContainer[0].scrollHeight - $chatContainer[0].scrollTop <= $chatContainer[0].clientHeight;
	}

	function _scrollToBottom() {
		$chatContainer[0].scrollTop = $chatContainer[0].scrollHeight;
	}

})();
