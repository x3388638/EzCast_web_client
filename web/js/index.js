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
	$inputMsg.focus();
	// TODO: get my ip
	// TODO: set interval to send multicast to find server

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
