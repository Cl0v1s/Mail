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
			const parent = folder.name.indexOf('.') !== -1 
			? folder.name.split('.')[0]
			: null;

			return {
				// highestmodseq: folder.highestmodseq,
				name: folder.name,
				unread: 0, // TODO: get new email number
				length: folder.length,
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
				folder,
			}
		};
		const response = await this.ask(request);
		if(response.type != "getMailsResponse") {
			// TODO: error unable to retrieve mails
			console.error(response);
			return null;
		}
		const mails = response.content.map((mail, index) => {
			mail["id"] = index;
			return mail; 
		})
		folder.mails = mails;
		folder.length = folder.mails.length;
		return folder;
	}
}

export default Backend.INSTANCE;
