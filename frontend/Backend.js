import md5 from 'blueimp-md5';

class Backend {
	static INSTANCE = new Backend();

	constructor() {
		this.sessions = [
			this.createSession(),
		];
	}

	createSession = () => {
		console.log('New session');
		const session  = {
			socket: new WebSocket("ws://localhost:8081/echo"),
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
		return session;
	}

	getAvailableSession = () => {
		const available = this.sessions.filter(session => session.callback == null);
		if(available > 0) return available[0];
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
			type: "getFoldersRequest"
		};
		const response = await this.ask(request);
		if(response.type != "getFoldersResponse") {
			debugger;
			console.error(response);
		}
		return response.content.map((entry) => {
			const previous = previousFolders != null && previousFolders.find(a => a.name == entry.name);
			let isNew = false;
			if(previous) isNew = previous.highestmodseq != entry.highestmodseq;

			return {
				name: entry.name,
				length: entry.length,
				highestmodseq: entry.highestmodseq,
				isNew,
			}
		});
	}

	getMails = async (folder, previousMails) => {
		const request = {
			type: "getMailsRequest",
			content: {
				folder,
			}
		};
		const response = await this.ask(request);
		return response.content.map((entry) => {
			const hash = md5(
				entry.Date + entry.Subject + JSON.stringify(entry.From) + JSON.stringify(entry.To)
			);
			const previous = previousMails != null && previousMails.find(a => a.hash === hash);

			return {
				...entry,
				isNew: previous == null,
				hash,
			}
		})
	}
}

export default Backend.INSTANCE;
