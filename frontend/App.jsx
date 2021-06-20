import React, { Component } from 'react';

import './App.scss';

/*
import { Button, ButtonOutline } from './common/Button/Button.jsx';
import { Checkbox } from './common/Checkbox/Checkbox.jsx';
import { Input } from './common/Input/Input.jsx';
import { Select } from './common/Select/Select.jsx';
import { MailEntry } from './mail/MailEntry/MailEntry.jsx';
*/

import ZI from './ZI/ZI.jsx';

const tara = {
	name: 'Tara Doggo',
	address: 'tara@doggo.com'
};

const dog = {
	name: 'Dog Doggo',
	address: 'dog@doggo.com'
};

const clovis = {
	name: 'Clovis Doggo',
	address: 'clovis@doggo.com'
};

const mails = [
	{
		headers: {
			Date: '12/06/2021 22:00',
			Subject: 'Hello world',
			From: [tara],
			To: [clovis]
		},
	}, {
		headers: {
			Date: '12/06/2021 22:30',
			Subject: 'Re: Hello world',
			From: [clovis],
			To: [tara]
		},
	}, {
		headers: {
			Date: '12/06/2021 23:00',
			Subject: 'Fwd: Re: Re: Hello world',
			From: [tara],
			To: [clovis, dog]
		},
	}, {
		headers: {
			Date: '12/06/2021 23:30',
			Subject: 'Re: Fwd: Re: Re: Hello world',
			From: [dog],
			To: [clovis, tara]
		},
	}, {
		headers: {
			Date: '12/06/2021 21:30',
			Subject: 'Test',
			From: [clovis],
			To: [tara]
		},
	}, {
		headers: {
			Date: '12/06/2021 22:30',
			Subject: 'Re: Test',
			From: [tara],
			To: [clovis]
		},
	}, {
		headers: {
			Date: '12/06/2021 23:35',
			Subject: 'Prout',
			From: [clovis],
			To: [tara]
		},
	}, {
		headers: {
			Date: '12/06/2021 23:50',
			Subject: 'Re: Prout',
			From: [tara],
			To: [clovis]
		},
	}, {
		headers: {
			Date: '12/06/2021 23:35',
			Subject: 'Bonjour',
			From: [clovis],
			To: [tara]
		},
	}, {
		headers: {
			Date: '12/06/2021 23:50',
			Subject: 'Re: Bonjour',
			From: [tara],
			To: [clovis]
		},
	}, {
		headers: {
			Date: '12/06/2021 23:50',
			Subject: 'Encore une conv',
			From: [tara],
			To: [clovis]
		},
	}
]

export default class App extends Component {
	constructor(props) {
		super(props);
	}

	onClick = () => console.log('onClick');


	render() {
		return <ZI address={tara} mails={mails} />
	}

	/*
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
	*/

};