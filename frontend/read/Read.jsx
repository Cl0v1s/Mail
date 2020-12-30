import React, { Component} from 'react';

import ModelContext from './../Model';

export default class Read extends Component {
	static contextType = ModelContext;

	constructor(props) {
		super(props);
	}

	componentDidMount() {
		this.prepapreBody();
	}

	prepapreBody = async () => {
		const mail = this.context.model.currentConversation[0];
		if(body != null) return;
		
	}

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
					{ mail.body }
				</div>
			</div>
		)
	}
}