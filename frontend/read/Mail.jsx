import React, { Component} from 'react';
import PropTypes from 'prop-types';

import Backend from '../Backend';

import ModelContext from './../Model';

export default class Mail extends Component {
	static contextType = ModelContext;

	static propTypes = {
		mail: PropTypes.object.isRequired,
		folder: PropTypes.object.isRequired,
	}

	static defaultAlternative = "text/plain";

	constructor(props) {
		super(props);

		this.state = {
			alternative: Mail.defaultAlternative,
			alternatives: null,
			body: null,
		}
	}

	async componentDidMount() {
		const body = await this.getBody();
		const alternatives = this.prepareAlternatives(body);

		this.setState({
			body,
			alternatives,
		})
	}

	getBody = async () => {
		const mail = this.props.mail;
		const folder = this.props.folder;

		if(mail.body != null) {
			return mail.body;
		};
		const body = await Backend.getBody(folder, mail);
		return body;
	};

	prepareAlternatives = (body) => {
		if(body.headers["Content-Type"].type != "multipart/alternative") {
			return null;
		};
		const alternatives = body.parts.map((part) => part.headers["Content-Type"].type);
		return alternatives;
	};

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
		const mail = this.props.mail;
		return (
			<div className="component-mail">
				<div>
					{ mail.Subject }
				</div>
				<div>
					{ mail.Date }
				</div>
				<div>
					{ 
						this.state.alternatives &&
						this.state.alternatives.map((alt, i) => 
							<button key={i} onClick={() => this.onSwitchAlternative(alt)}>{alt}</button>
						)
					}
				</div>
				<div>
					{ this.state.body == null ? <i className="fa fa-circle-notch fa-spin"></i> : this.renderBody(this.state.body) }
				</div>
			</div>
		)
	}
}