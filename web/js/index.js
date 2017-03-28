var App = (_ => {
	/**
	 * cache dom
	 */
	var $chatContainer = $('#chatContainer');
	var $inputContainer = $('#inputContainer');
	var $inputName = $inputContainer.find('#name');
	var $inputMsg = $inputContainer.find('#inputMsg');
	var $editNameModal = $('#modal-editName');

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
	$editNameModal.on('click', '#btn-editName', _handleEditName);
	
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
			if(msg == '') {
				return;
			}
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
			_userName = msg.data.name;
			$inputName.text(_userName);
			$editNameModal.find('#input-editName').val(_userName);
			_getHistoryMsg();
		} else {
			console.log('register fail.');
		}
	}

	function _handleOnMessage(data) {
		data = JSON.parse(data);
		console.log(`===== receive msg from ${data.data.ip} =====`);
		switch(data.event) {
			case 'newMessage': 
				_renderMsg('current', {
					msg: data.data.msg, 
					ip: data.data.ip, 
					name: data.data.name, 
					time: data.data.time
				});
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

	function _handleEditName() {
		var newName = $editNameModal.find('#input-editName').val();
		$.ajax({
			url: `${_APITarget}/user`, 
			type: 'post', 
			dataType: 'json', 
			data: {
				name: newName
			}, 
			success: function(data) {
				localStorage.EzCastUser = newName;
				$inputName.text(newName);
				$editNameModal.modal('hide');
			}, 
			error: function(jqXHR) {
				console.log(jqXHR);
			}
		})
	}

	function _getHistoryMsg() {
		$.ajax({
			url: `${_APITarget}/message`, 
			type: 'get', 
			dataType: 'json', 
			success: function(data) {
				if(!data.err) {
					for(let msg of data.list) {
						_renderMsg('history', msg);
					}
				}
			}, 
			error: function(jqXHR) {
				console.log(jqXHR);
			}
		});
	}
	
	/**
	 * [_renderMsg description]
	 * @param  type   'current' || 'history'
	 * @param  msgObj {msg, ip, name, ip}
	 */
	function _renderMsg(type, msgObj) {
		let $container = type == 'history' ? $chatContainer.find('#history') : $chatContainer.find('#current');
		$container.append(
			`<div class="msgRow">
				<div class="title">
					<span class="name">${msgObj.name}</span><br />
					<span class="ip">${msgObj.ip}</span>
					<span class="time float-right"><span class="badge badge-pill badge-default">${msgObj.time}</span></span>
				</div>
				<div class="content">${msgObj.msg}</div>
			</div>`
		);
		if(type == 'history' || type == 'current' && _autoScroll) {
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
