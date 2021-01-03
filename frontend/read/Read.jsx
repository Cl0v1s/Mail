import React, { Component } from 'react';
import ModelContext from '../Model';
import Backend from '../Backend';

import Mail from './Mail.jsx';

export default class Read extends Component {
	static contextType = ModelContext;

	constructor(props) {
		super(props);

		this.currentFolder = null;
		this.conversation = null;
	}

	async componentDidMount() {
		this.currentFolder = this.context.model.folders[this.context.model.currentFolderIndex];
		this.conversation = this.context.model.currentConversation;

		Backend.searchMails();
	}

	onBackList = () => {
		this.context.updateModel({
			currentConversation: [],
		})
	}

	render() {
		const conversation = this.context.model.currentConversation;
		const folder = this.context.model.folders[this.context.model.currentFolderIndex];
		return (
			<div className="component-read">
				<div className="tools">
					<button onClick={this.onBackList}>Consulter la boîte mail</button>
				</div>
				<div className="content">
				{
					conversation &&
					conversation.map((mail, i) => <Mail key={i} folder={folder} mail={mail} />)
				}
				</div>
			</div>
		)
	}
}