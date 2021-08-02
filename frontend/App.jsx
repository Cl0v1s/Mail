import React, { Component } from 'react';

import AppContext from './model/context';
import './App.scss';

import Mails from './views/Mails';

export default class App extends Component {
	constructor(props) {
		super(props);
	}

	onClick = () => console.log('onClick');


	render() {
		return (
			<AppContext.Provider>
				<Mails />
			</AppContext.Provider>
		);
	}
};