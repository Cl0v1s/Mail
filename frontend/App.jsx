import React, { Component } from 'react';

import './theme.css';

import { Button, ButtonPrimary, ButtonSecondary, ButtonPrimaryOutline, ButtonSecondaryOutline } from './common/Button/Button.jsx';

export default class App extends Component {
	constructor(props) {
		super(props);
	}

	onClick = () => alert('onClick');

	render() {
		return (
			<div className="component-app">
				<ButtonPrimary onClick={this.onClick}>Je suis un bouton</ButtonPrimary>
				<ButtonSecondary onClick={this.onClick}>Je suis un bouton</ButtonSecondary>
				<ButtonPrimaryOutline onClick={this.onClick}>Je suis un bouton</ButtonPrimaryOutline>
				<ButtonSecondaryOutline onClick={this.onClick}>Je suis un bouton</ButtonSecondaryOutline>
				<Button onClick={this.onClick}>Je suis un bouton</Button>
			</div>
		);
	}

};