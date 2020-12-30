import md5 from 'blueimp-md5';

class Backend {
	static INSTANCE = new Backend();

	constructor() {
		this.sessions = [
			this.createSession(),
		];
	}

	createSession = () => {
		console.log('Creating session...');
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
				if(this.sessions.length > 1) {
					session.socket.close();
					const index = this.sessions.findIndex(s => s === session);
					this.sessions.splice(index, 1);
					console.log('Removed session '+index);
				}
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
		const available = this.sessions.findIndex(session => {
			return session.callback == null
		});
		if(available >= 0) {
			console.log('Reusing session '+available);
			return this.sessions[available];
		}
		const session = this.createSession();
		this.sessions.push(session);
		return session;
	}

	ask = (request) => {
		const session = this.getAvailableSession();
		return new Promise(async (resolve, reject) => {
			session.callback = resolve;
			await session.ready;
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
		return response.content.map((entry, index) => {
			const hash = md5(
				entry.Date + entry.Subject + JSON.stringify(entry.From) + JSON.stringify(entry.To)
			);
			const previous = previousMails != null && previousMails.find(a => a.hash === hash);

			return {
				...entry,
				id: index+1,
				isNew: previous == null,
				hash,
				body: null,
			}
		})
	};

	getBody = async (folder, mail) => {
		const request = {
			type: "getBodyRequest",
			content: {
				folder: folder.name,
				id: mail.id.toString(),
				"Content-Type": mail["Content-Type"],
			}
		}
		const response = await this.ask(request);
		return response.content;
	}
}

export default Backend.INSTANCE;
