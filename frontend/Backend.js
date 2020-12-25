class Backend {
	static INSTANCE = new Backend();

	constructor() {
		this.websocket = new WebSocket("ws://localhost:8081/echo");
		this.callback = null;

		this.websocket.onmessage=(evt) => {
			const payload = JSON.parse(evt.data);
			if(this.callback != null) {
				console.log(payload);
				this.callback(payload);
				this.callback = null;
			}
		}

		this.ready = new Promise((resolve) => {
			this.websocket.onopen=(evt) => {
				console.log('Socket ready');
				resolve();
			};
		});

	}

	ask = (request) => {
		return new Promise(async (resolve, reject) => {
			await this.ready;
			this.callback = resolve;
			this.websocket.send(JSON.stringify(request));
		});
	}
}

export default Backend.INSTANCE;

/*
ws=
		ws.onmessage=function(evt){
			const payload = JSON.parse(evt.data);

			console.log(payload.type);
			switch(payload.type) {
				case "getMailsResponse": {
					const mail = payload.content[payload.content.length - 1];
					console.log(JSON.stringify(mail, null, 4));
					ws.send(JSON.stringify({
						"type": "getBodyRequest",
						"content": {
							"folder": "INBOX",
							"id": (payload.content.length).toString(),
							"Content-Type": mail["Content-Type"],
						}
					}))
					break;
				}
				case "getBodyResponse": {
					console.log(JSON.stringify(payload.content, null, 4));
					break;
				}
				default: {
					break;
				}
			}

			//console.log(payload);
		};
		ws.onopen=function(evt){
			ws.send('{"type": "getMailsRequest", "content": { "folder": "INBOX" }}');
		}
	*/