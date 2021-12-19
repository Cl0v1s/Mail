// const WebSocket = require('ws');

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
			console.log(request);
			session.socket.send(JSON.stringify(request));
		});
	}
}

module.exports = Backend.INSTANCE;
