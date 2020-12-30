import React from 'react';

export class Model {

	constructor() {
		this.folders = [];
		this.mails = {};
		this.currentFolderIndex = null;
		this.currentConversation = [];
		this.currentComposition = "";
	}

	static load() {
		const raw = localStorage.getItem("model");
		if(raw == null) return new Model();
		const parsed = JSON.parse(raw);
		const result = new Model();
		Object.keys(parsed).forEach((key) => {
			result[key] = parsed[key];
		});
		return result;
	}

	static save(data) {
		localStorage.setItem("model", JSON.stringify(data));
	}
}

export default React.createContext({
	model: Model.load(),
	updateModel: () => {},
})