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

	function _showNotification(msg) {
		var n = new Notification('公告', {
			body: msg,
			icon: 'http://d2e70e9yced57e.cloudfront.net/edu/images/posts/12392/fraud-alert-credit-report.jpg'
		});
		n.onclick = function () {
			n.close();
			window.focus();
		}
	}

	function getHistoryMsg() {
		let _APITarget = App.getAPITarget();
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

	/**
	 * [_renderMsg description]
	 * @param  type   'current' || 'history'
	 * @param  msgObj {msg, ip, name, ip}
	 */
	function renderMsg(type, msgObj) {
		let $container = type == 'history' ? $chatContainer.find('#history') : $chatContainer.find('#current');
		type == 'current' && msgObj.admin && App.getNotificationPermission() && App.getNotificationPermission() != 'denied' && _showNotification(msgObj.msg);
		$container.append(
			`<div class="msgRow ${msgObj.admin ? 'admin' : ''}">
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
		renderMsg, 
		getHistoryMsg
	}
})();
