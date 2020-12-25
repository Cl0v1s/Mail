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

	getFolders = async () => {
		const request = {
			type: "getFoldersRequest",
		};
		const response = await this.ask(request);
		if(response.type !== "getFoldersResponse") {
			// TODO: error unable to retrieve folders
			console.error(response);
			return null;
		}

		return response.content.map((folder) => {
			const parent = folder.indexOf('.') !== -1 
			? folder.split('.')[0]
			: null;

			return {
				name: folder,
				unread: 0,
				mails: [],
				parent,
			};
		}).sort((a, b) => {
			if(a.name === b.parent) return -1;
			if(b.name === a.parent) return 1;
			return 0;
		})
	}

	getMails = async (folder) => {
		const request = {
			type: "getMailsRequest",
			content: {
				folder: folder.name,
			}
		};
		const response = await this.ask(request);
		if(response.type != "getMailsResponse") {
			// TODO: error unable to retrieve mails
			console.error(response);
			return null;
		}
		folder.mails = response.content;
		return folder;
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