import React, { Component} from 'react';
import PropTypes from 'prop-types';

import Backend from '../Backend';

import ModelContext from './../Model';

export default class Read extends Component {
	static contextType = ModelContext;

	static propTypes = {
		'mail': PropTypes.object.isRequired,
	}

	static defaultAlternative = "text/plain";

	constructor(props) {
		super(props);

		this.state = {
			alternative: Read.defaultAlternative,
			alternatives: null,
		}
	}

	async componentDidMount() {
		const mail = await this.prepareBody();
		this.prepareAlternatives(mail);
	}

	prepareBody = () => new Promise(async (resolve) => {
		const folder = this.context.model.folders[this.context.model.currentFolderIndex];
		let mail = this.context.model.currentConversation[0];
		if(mail.body != null) {
			resolve(mail);
			return;
		};
		const body = await Backend.getBody(folder, mail);
		mail = {
			...mail,
			body: body,
		};
		this.context.updateModel({
			currentConversation: [mail],
		}, () => resolve(mail));
	}); 

	prepareAlternatives = (mail) => new Promise((resolve) => {
		if(mail.body.headers["Content-Type"].type != "multipart/alternative") {
			resolve();
			return;
		};
		const alternatives = mail.body.parts.map((part) => part.headers["Content-Type"].type);
		this.setState({
			alternatives,
		}, resolve);
	});

	renderBody = (part) => {
		switch(part.headers["Content-Type"].type) {
			case "multipart/alternative": {
				const alternative = this.state.alternative;
				let selected = part.parts.find((p) => p.headers["Content-Type"].type == alternative);
				if(selected == null) selected = part.parts[0];
				return this.renderBody(selected);
			}
			case "text/plain": {
				return <pre>{part.content}</pre>
			}
			case "text/html": {
				//TODO: to sanitize 
				return <div dangerouslySetInnerHTML={{__html: part.content}}></div>
			}
			default: {
				alert('Unsupported MIME '+part.headers["Content-Type"].type);
				return part.content;
			}
		}
	}

	onSwitchAlternative = (alt) => this.setState({ alternative: alt }); 

	render() {
		const mail = this.context.model.currentConversation[0];
		return (
			<div className="component-read">
				<div>
					{ mail.Subject }
				</div>
				<div>
					{ mail.Date }
				</div>
				<div>
					{ 
						this.state.alternatives &&
						this.state.alternatives.map((alt) => 
							<button onClick={() => this.onSwitchAlternative(alt)}>{alt}</button>
						)
					}
				</div>
				<div>
					{ mail.body == null ? <i className="fa fa-circle-notch fa-spin"></i> : this.renderBody(mail.body) }
				</div>
			</div>
		)
	}
}