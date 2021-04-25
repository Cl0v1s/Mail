import React, { Component } from 'react';

import './theme.css';

import { Button, ButtonPrimary, ButtonSecondary, ButtonPrimaryOutline, ButtonSecondaryOutline } from './common/Button/Button.jsx';
import { Checkbox } from './common/Checkbox/Checkbox.jsx';
import { Input } from './common/Input/Input.jsx';

export default class App extends Component {
	constructor(props) {
		super(props);
	}

	onClick = () => console.log('onClick');

	render() {
		return (
			<div className="component-app">
				<div>
					<ButtonPrimary className="m-1" onClick={this.onClick}>Je suis un bouton</ButtonPrimary>
					<ButtonSecondary className="m-1" onClick={this.onClick}>Je suis un bouton</ButtonSecondary>
					<ButtonPrimaryOutline className="m-1" onClick={this.onClick}>Je suis un bouton</ButtonPrimaryOutline>
					<ButtonSecondaryOutline className="m-1" onClick={this.onClick}>Je suis un bouton</ButtonSecondaryOutline>
					<Button className="m-1" onClick={this.onClick}>Je suis un bouton</Button>
				</div>
				<div>
					<Checkbox className="m-1" onChange={this.onClick} />
					<Checkbox className="m-1" checked onChange={this.onClick} />
				</div>
				<div>
					<Input onChange={this.onClick} />
					<Input className={Input.STATES.DISABLED + ' m-1'} onChange={this.onClick} />
					<Input placeholder="Bonjour" onChange={this.onClick} />
				</div>
			</div>
		);
	}

};