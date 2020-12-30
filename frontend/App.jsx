import React, { Component } from 'react';

import ModelContext, { Model } from './Model';

import List from './list/List.jsx';
import Read from './read/Read.jsx';

export default class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			model: Model.load(),
			updateModel: this.updateModel,
		}
	}

	updateModel = (props, callback = null) => {
		this.setState(prevState => ({
			model: {
				... prevState.model,
				... props
			}
		}), () => {
			Model.save(this.state.model);
			if(callback) callback();
		});
	}

	render() {
		return (
			<div className="component-app">
				<ModelContext.Provider value={this.state}>
					{
						this.state.model.currentConversation.length == 0
						? <List />
						: <Read />
					}
				</ModelContext.Provider>
			</div>
		);
	}

};