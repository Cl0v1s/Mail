import React, {Component} from 'react';
import PropTypes from 'prop-types';

import MailHeader from './MailHeader.jsx';

export default class MailList extends Component {
	static propTypes = {
		mails: PropTypes.arrayOf(PropTypes.object).isRequired,
		onClick: PropTypes.func.isRequired,
	};

	constructor(props) {
		super(props);

		this.state = this.load();
	}

	load = () => {
		const raw = localStorage.getItem('MailList');
		if(raw) {
			const save = JSON.parse(raw);
			return save;
		}
		return {
			date: 1,
		}
	}

	save = () => {
		localStorage.setItem('MailList', JSON.stringify(this.state));
	}

	setState = (state, callback = null) => {
		super.setState(state, () => {
			this.save();
			if(callback) callback();
		});
	}

	onChangeDateOrder = () => {
		this.setState({
			date: this.state.date * -1
		})
	}

	render() {
		return (
			<div className="component-mail-list">
				<div className="tools text-right p-2">
					<button className="bg-purple-500 bg-white w-100 text-white p-2 rounded" onClick={this.onChangeDateOrder}>
						<i className={`fa ${this.state.date == 1 ? 'fa-arrow-down' : 'fa-arrow-up'}`}></i> Date
					</button>
				</div>
				<div className="list">
					{
						this.props.mails
							.sort((_a, _b) => {
								const a  = Date.parse(_a.Date);
								const b  = Date.parse(_b.Date);
								return (a - b) * this.state.date
							})
							.map((mail, i) => <MailHeader key={i} mail={mail} onClick={this.props.onClick} />)

					}
				</div>
			</div>
		)
	}
}