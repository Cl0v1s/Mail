import React, { Component } from 'react';

import ModelContext, { Model } from './Model';

import List from './list/List.jsx';

export default class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			model: Model.load(),
			updateModel: this.updateModel,
		}
	}

	updateModel = (props) => {
		this.setState(prevState => ({
			model: {
				... prevState.model,
				... props
			}
		}), () => Model.save(this.state.model));
	}

	render() {
		return (
			<div className="component-app">
				<ModelContext.Provider value={this.state}>
					<List />
				</ModelContext.Provider>
			</div>
		);
	}

};