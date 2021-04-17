import React, { Component } from 'react';

import AppContext from './model/context';

export default class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			store: null,
		}
	}

	render() {
		return (
			<div className="component-app">
				<AppContext.Provider
					value={{
						store: this.state.store,
					}}
				>
				</AppContext.Provider>
			</div>
		);
	}

};