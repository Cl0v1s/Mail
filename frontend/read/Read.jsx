import React, { Component } from 'react';
import ModelContext from '../Model';

import Mail from './Mail.jsx';

export default class Read extends Component {
	static contextType = ModelContext;

	constructor(props) {
		super(props);

		this.currentFolder = null;
		this.currentMail = null;
		this.conversation = null;
	}

	async componentDidMount() {
		this.currentFolder = this.context.model.folders[this.context.model.currentFolderIndex];
		this.conversation = this.context.model.currentConversation;
		this.currentMail = await this.getBody(this.currentFolder, this.conversation[0]);
	}

	getBody = async (folder, mail) => {
		if(mail.body != null) {
			return mail;
		};
		const body = await Backend.getBody(folder, mail);
		mail = {
			...mail,
			body: body,
		};
		return mail;
	}; 

	render() {
		const conversation = this.context.model.currentConversation;
		return (
			<div className="component-read">
				{
					conversation &&
					conversation.map((mail, i) => <Mail key={i} mail={mail} />)
				}
			</div>
		)
	}
}