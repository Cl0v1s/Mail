import React, { Component } from 'react';

import { Account, Folder, Mail } from './model/actions';

import AppContext from './model/context';

import Read from './Read.jsx';

export default class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			accounts: [],
			folders: [],
			mails: [],
		}
	}

	actions = ({
		Account: {
			...Account,
			init: async (name, key, imap, smtp) => {
				if(await Account.init(name, key, imap, smtp)) this.setState({ accounts: this.state.accounts.concat([{ name, key, imap, smtp}])});
			},
			list: async () => this.setState({ accounts: await Account.list()}),
			remove: async (account) => {
				if(await Account.remove(account)) this.setState({ accounts: this.state.accounts.filter((a) => a.name != account.name)});
			}
		},
		Folder: {
			...Folder,
			create: async (folder) => {
				if(await Folder.create(folder)) this.setState({ folders: this.state.folders.concat([folder]) });
			},
			list: async () => this.setState({ folders: await Folder.list() }),
			remove: async (folder) => {
				if(await Folder.remove(folder)) this.setState({ folders: this.state.folders.filter((a) => a.name != folder.name)});
			},
		},
		Mail: {
			...Mail,
			list: async (folder = null, filter = null) => {
				let mails = [];
				if(folder == null) {
					const promises = this.state.folders.map((folder) => Mail.list(folder, filter));
					const all = await Promise.all(promises);
					mails = all.flat();
				} else {
					mails = mails.concat(await Mail.list(folder, filter));
					if(!filter) {
						mails = mail.concat(this.state.mails.filter((m) => m.folder !== folder.name))
					}
				}
				this.setState({ mails });
			},
			get: async (mail) => {
				const complete = await Mail.get(mail);
				this.setState({
					mails: this.state.mails.map((m) => m.id === complete.id && m.folder === complete.folder ? complete : m),
				})
			},
			remove: async (mail) => {
				if(await Mail.remove(mail)) this.setState({
					mails: this.state.mails.filter((m) => m.folder !== mail.folder && m.id !== mail.id),
				});
			}
		}
	})

	render() {
		return (
			<div className="component-app">
				<AppContext.Provider
					value={{
						store: {
							accounts: this.state.accounts,
							folders: this.state.folders,
							mails: this.state.mails,
						},
						actions: this.actions
					}}
				>
					<Read />
				</AppContext.Provider>
			</div>
		);
	}

};