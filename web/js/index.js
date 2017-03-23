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
	var _serverIP = null;
	var socket = io();
	var connectInterval = 0;
	$inputMsg.focus();
	// TODO: get my ip
	// TODO: set interval to send multicast to find server
	connectInterval = setInterval(function() {
		socket.emit('connectToServer', '');
	}, 2000);

	/**
	 * bindEvent
	 */
	$inputMsg.on('keypress', _handleSendMsg);

	function _handleSendMsg(e) {
		if(e.keyCode == 13) {
			var msg = $inputMsg.val().trim();
			console.log(msg);
			$inputMsg.val('');
		}
	}

})();
