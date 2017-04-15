var ChatScreen = (_ => {

	/**
	 * init 
	 */
	var _autoScroll = true;

	/**
	 * cache DOM
	 */
	var $chatContainer = $('#chatContainer');

	/**
	 * bind event
	 */
	$chatContainer.on('scroll', _handleScroll);

	function _handleScroll() {
		if(_isScrollBottom()) {
			_autoScroll = true;
		} else {
			_autoScroll = false;
		}
	}

	function _isScrollBottom() {
		return $chatContainer[0].scrollHeight - $chatContainer[0].scrollTop <= $chatContainer[0].clientHeight;
	}

	function _scrollToBottom() {
		$chatContainer[0].scrollTop = $chatContainer[0].scrollHeight;
	}

	/**
	 * [_renderMsg description]
	 * @param  type   'current' || 'history'
	 * @param  msgObj {msg, ip, name, ip}
	 */
	function renderMsg(type, msgObj) {
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

	return {
		renderMsg
	}
})();
