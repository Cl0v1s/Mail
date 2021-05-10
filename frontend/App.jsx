import React, { Component } from 'react';

import './style/theme.scss';

import { Button, ButtonOutline } from './common/Button/Button.jsx';
import { Checkbox } from './common/Checkbox/Checkbox.jsx';
import { Input } from './common/Input/Input.jsx';
import { Select } from './common/Select/Select.jsx';
import { MailEntry } from './mail/MailEntry/MailEntry.jsx';

export default class App extends Component {
	constructor(props) {
		super(props);
	}

	onClick = () => console.log('onClick');

	render() {
		return (
			<div className="component-app">
				<div>
					<Button className="m-1 bg-color-primary text-color-0" onClick={this.onClick}>Je suis un bouton</Button>
					<Button className="m-1 bg-color-secondary text-color-0" onClick={this.onClick}>Je suis un bouton</Button>
					<Button className="m-1 bg-color-alert-50 text-color-0" onClick={this.onClick}>Je suis un bouton</Button>
					<Button className="m-1 bg-color-alert-75 text-color-100" onClick={this.onClick}>Je suis un bouton</Button>
					<Button className="m-1 bg-color-alert-100 text-color-100" onClick={this.onClick}>Je suis un bouton</Button>

					<ButtonOutline className="m-1 text-color-primary" onClick={this.onClick}>Je suis un bouton</ButtonOutline>
					<ButtonOutline className="m-1 text-color-secondary" onClick={this.onClick}>Je suis un bouton</ButtonOutline>
					<ButtonOutline className="m-1 text-color-alert-50" onClick={this.onClick}>Je suis un bouton</ButtonOutline>
					<ButtonOutline className="m-1 text-color-alert-75" onClick={this.onClick}>Je suis un bouton</ButtonOutline>
					<ButtonOutline className="m-1 text-color-alert-100" onClick={this.onClick}>Je suis un bouton</ButtonOutline>
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
					<div className="m-2">
						<Select
							value='2'
							options={[{label: 'test', value: '1'}, {label: 'test1', value: '2'}]}
							onChange={(val) => console.log(val)}
						/>
					</div>
					<div className="m-2">
						<Select
							disabled
							value='2'
							options={[{label: 'test', value: '1'}, {label: 'test1', value: '2'}]}
							onChange={(val) => console.log(val)}
						/>
					</div>
				</div>
				<div>
					<MailEntry
						mail={{
							id: "1",
							headers: {
								Date: '12-08-1996',
								Subject: 'Présentation',
								From: {
									name: 'Mogomogane',
									address: 'mogomoganedu47@hotmail.fr'
								},
							}
						}}
						onClick={this.onClick}
					/>
				</div>
			</div>
		);
	}

};