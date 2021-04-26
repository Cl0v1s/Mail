import React, { Component } from 'react';

import './theme.scss';

import { Button, ButtonPrimary, ButtonSecondary, ButtonPrimaryOutline, ButtonSecondaryOutline } from './common/Button/Button.jsx';
import { Checkbox } from './common/Checkbox/Checkbox.jsx';
import { Input } from './common/Input/Input.jsx';
import { Select } from './common/Select/Select.jsx';

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
					<Input state={Input.STATES.DISABLED} className="m-1" onChange={this.onClick} />
					<Input placeholder="Bonjour" onChange={this.onClick} />
				</div>
				<div>
					<Select
						value='2'
						options={[{label: 'test', value: '1'}, {label: 'test1', value: '2'}]}
						onChange={(val) => console.log(val)}
					/>
				</div>
			</div>
		);
	}

};