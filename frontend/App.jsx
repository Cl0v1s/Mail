import React, { Component } from 'react';

import { Account, Folder, Mail } from './model/actions';

import AppContext from './model/context';

import Read from './Read.jsx';

// chargement temporaire de la configuration
import config from './model/config.json';

export default class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			accounts: [],
			folders: [],
			mails: [],
		}
	}

	async componentDidMount() {
		// Chargement temporaire d'un compte par défaut
		await this.actions.Account.init(config.name, config.key, config.imap, config.smtp);
		await this.actions.Account.use(config);
		await this.actions.Folder.list();
		console.log(this.state.folders);
		if(this.state.folders.length <= 0) return;
		await this.actions.Mail.list(this.state.folders[0]);
		await this.actions.Mail.get(this.state.mails[0]);
	}

	actions = ({
		Account: {
			...Account,
			init: async (name, key, imap, smtp) => {
				if(await Account.init(name, key, imap, smtp)) this.setState({ accounts: this.state.accounts.concat([{ name, key, imap, smtp}])});
			},
			list: () => new Promise(async (resolve) => {
				this.setState({ accounts: await Account.list() }, resolve)
			}),
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
			list: (folder = null, filter = null) => new Promise(async (resolve) => {
				let mails = [];
				if(folder == null) {
					const promises = this.state.folders.map((folder) => Mail.list(folder, filter));
					const all = await Promise.all(promises);
					mails = all.flat();
				} else {
					mails = mails.concat(await Mail.list(folder, filter));
				}
				this.setState({ mails }, resolve);
			}),
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