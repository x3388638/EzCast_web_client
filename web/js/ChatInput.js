var ChatInput = (_ => {

	/**
	 * cache DOM
	 */
	var $inputContainer = $('#inputContainer');
	var $editNameModal = $('#modal-editName');
	var $inputName = $inputContainer.find('#name');
	var $inputMsg = $inputContainer.find('#inputMsg');

	/**
	 * init
	 */
	var _msgHistory = []; // queue
	var _msgHistoryLimit = 10;
	var _msgHistoryIndex = 0; // up arrow => +1
	$inputMsg.focus();
	
	/**
	 * bind event
	 */
	$inputMsg.on('keypress', _handleSendMsg);
	$inputMsg.on('keydown', _handleKeydown);
	$editNameModal.on('click', '#btn-editName', _handleEditName);

	function _handleSendMsg(e) {
		if(e.keyCode == 13) {
			let _APITarget = App.getAPITarget();
			if(_APITarget == null) {
				return;
			}
			var msg = $inputMsg.val().trim();
			if(msg == '') {
				return;
			}
			$inputMsg.val('');
			// store msg
			_msgHistory = [..._msgHistory, msg];
			_msgHistory.length > _msgHistoryLimit && _msgHistory.shift();
			_msgHistoryIndex = 0;

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

	function _handleKeydown(e) {
		switch (e.keyCode) {
			case 38:
				// up arrow
				_showHistoryMsg(1);
				break;
			case 40:
				// down arrow
				_showHistoryMsg(-1);
				break;
		}
	}

	function _handleEditName() {
		var newName = $editNameModal.find('#input-editName').val();
		let _APITarget = App.getAPITarget();
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

	function _showHistoryMsg(key) {
		// console.log(`ori index: ${_msgHistoryIndex}`);
		_msgHistoryIndex += key;
		if (_msgHistoryIndex < 0) {
			_msgHistoryIndex = 0
		}
		if (_msgHistoryIndex > _msgHistory.length) {
			_msgHistoryIndex = _msgHistory.length
		}
		// console.log(`new index: ${_msgHistoryIndex}`);
		// console.log(_msgHistory);
		var msg = _msgHistory[_msgHistory.length - _msgHistoryIndex] || '';
		$inputMsg.val(msg);
		setTimeout(_ => {
			$inputMsg[0].setSelectionRange(msg.length, msg.length);	
		}, 1);
	}

	function setUser(name) {
		$inputName.text(name);
		$editNameModal.find('#input-editName').val(name);
	}

	return {
		setUser
	}

})();
