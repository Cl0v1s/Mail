class Backend {
	static INSTANCE = new Backend();

	static ADDR = "ws://localhost:8081/echo";

	constructor() {
		this.sessions = [
			this.createSession(),
		];
	}

	createSession = () => {
		const session  = {
			socket: new WebSocket(Backend.ADDR),
			callback: null,
			ready: null,
		};

		session.socket.onmessage = (evt) => {
			const payload = JSON.parse(evt.data);
			if(session.callback != null) {
				console.log(payload);
				session.callback(payload);
				session.callback = null;
			}
		};

		session.ready = new Promise((resolve) => {
			session.socket.onopen = (evt) => {
				console.log('Socket ready');
				resolve();
			};
		});
	}

	getAvailableSession = () => {
		const available = this.sessions.filter(session => session.callback == null);
		if(this.sessions.length > 0) return available[0];
		const session = this.createSession();
		this.sessions.push(session);
		return session;
	}

	ask = (request) => {
		const session = this.getAvailableSession();
		return new Promise(async (resolve, reject) => {
			await session.ready;
			session.callback = resolve;
			session.socket.send(JSON.stringify(request));
		});
	}

	getFolders = async (previousFolders) => {
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

			const previous = previousFolders && previousFolders.find(f => f.name == folder.name);

			return {
				// highestmodseq: folder.highestmodseq,
				name: folder.name,
				unread: 0, // TODO: get new email number
				length: folder.length,
				mails: previous ? previous.mails : [],
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
			mail["id"] = index+1;
			return mail; 
		})
		folder.mails = mails;
		folder.length = folder.mails.length;
		return folder;
	}

	getBody = async (folder, mail) => {
		const request = {
			type: "getBodyRequest",
			content: {
				folder: folder.name,
				id: mail.id.toString(),
				"Content-Type": mail["Content-Type"],
			}
		};
		const response = await this.ask(request);
		if(response.type != "getBodyResponse") {
			//TODO: error unable to retrieve mail body
			console.error(response);
			return null;
		}
		console.log(response);
	}
}

export default Backend.INSTANCE;
