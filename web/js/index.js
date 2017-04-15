var App = (_ => {
	/**
	 * cache dom
	 */
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
	var _userName = localStorage.EzCastUser || '';
	_registerInterval = setInterval(function() {
		_socket.emit('register', JSON.stringify({name: _userName}));
	}, 2000);

	/**
	 * bindEvent
	 */
	$editNameModal.on('click', '#btn-editName', _handleEditName);
	
	/**
	 * ws event
	 */
	_socket.on('register', _handleOnRegister);
	_socket.on('message', _handleOnMessage);

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
				ChatScreen.renderMsg('current', {
					msg: data.data.msg, 
					ip: data.data.ip, 
					name: data.data.name, 
					time: data.data.time
				});
				break;
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
						ChatScreen.renderMsg('history', msg);
					}
				}
			}, 
			error: function(jqXHR) {
				console.log(jqXHR);
			}
		});
	}
	
	function getAPITarget() {
		return _APITarget;
	}

	return {
		getAPITarget
	}

})();
