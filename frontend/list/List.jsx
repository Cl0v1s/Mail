import React, { Component } from 'react';

import ModelContext from './../Model';

import Backend from './../Backend';

export default class List extends Component {
	static contextType = ModelContext;

	static defautlFolder = "INBOX";

	constructor(props) {
		super(props);

		this.state = {
			loadingFolders: false,
			loadingFolderIndex: null,
		}
	}

	async componentDidMount() {
		await this.prepareFromCache();
		this.prepareFromRemote();
	}

	prepareFromCache = () => {
		// if currentFolderIndex isnt saved, we need to generate a new default
		if(this.context.model.currentFolderIndex != null) return; 
		return new Promise((resolve) => this.context.updateModel({
			currentFolderIndex: Math.max(
				this.context.model.folders.findIndex(f => f.name === List.defautlFolder),
				0
			)
		}, resolve));
	}

	prepareFromRemote = async () => {
		let selectedFolderIndex = this.context.model.currentFolderIndex;

		// getting folders and compare with saved data
		const previousFolders = this.context.model.folders.concat([]);
		const newFolders = await this.getFolders();
		const prevHash = previousFolders.map(f => f.name).join('');
		const newHash = newFolders.map(f => f.name).join('');
		// if new array and old array arent the same, selectedFolderIndex become default
		if(prevHash != newHash) {
			selectedFolderIndex = Math.max(
				this.context.model.folders.findIndex(f => f.name === List.defautlFolder),
				0
			);
		}
		// retrieving selected box first
		await this.getMails(selectedFolderIndex);
		// retrieving others 
		newFolders.forEach((folder, i) => {
			if(i === selectedFolderIndex) return;
			this.getMails(i);
		});
		// saving new selectedFolderIndex
		this.context.updateModel({
			currentFolderIndex: selectedFolderIndex
		})
	}

	getFolders = async () => {
		this.setState({
			loadingFolders: true,
		});
		const folders = await Backend.getFolders(this.context.model.folders);
		this.context.updateModel({
			folders
		});
		this.setState({
			loadingFolders: false,
		})
		return folders;
	}

	getMails = async (folderIndex) => {
		this.setState({
			loadingFolderIndex: folderIndex,
		});
		const folder = this.context.model.folders[folderIndex];
		const ms = await Backend.getMails(
			folder,
			this.context.model.mails[folder.name]
		);
		const mails = {
			...this.context.model.mails,
		};
		mails[folder.name] = ms;
		this.context.updateModel({
			mails,
		});
		this.setState({
			loadingFolderIndex: null,
		})
		return mails;
	}

	onSelectFolder = (index) => {
		this.setState({
			selectedFolderIndex: index,
		});
		this.getMails(index);
	}

	onClickMail = (mail) => {
		this.context.updateModel({
			currentConversation: [mail]
		});
	}

	/**
	 * Returns if there is any new mail for each folders
	 */
	getHasNewMails = () => {
		const result = {};
		Object.keys(this.context.model.mails).forEach((key) => {
			result[key] = this.context.model.mails[key].filter(m => m.isNew) > 0;
		});
		return result;
	}


	render() {
		const selectedFolderIndex = this.context.model.currentFolderIndex;
		if(selectedFolderIndex == null) return null;
		const folders = this.context.model.folders;
		if(folders.length == 0) return null;

		const news = this.getHasNewMails();
		const folder = folders[selectedFolderIndex];
		const mails = this.context.model.mails[folder.name];
		return (
			<div className="component-list">

				<div className="folders">
					<div className="flex">
						<h3 className="flex-grow">
							Dossiers
						</h3>
						<div>
							{
								this.state.loadingFolders &&
								<i className="fa fa-circle-notch fa-spin"></i>
							}
						</div>
					</div>
					<div>
							{
								folders.map((folder, i) => (
									<div key={i} onClick={() => this.onSelectFolder(i)}>
										{ (folder.isNew || news[folder.name]) && "Nouveau" }
										{ folder.name }
									</div>
								))
							}
					</div>
				</div>
				
				<div className="mails">
						<div className="infos">
							{
								folder != null &&
								<h3>{ folder.name }</h3>
							}
						</div>
						<div>
						{
							this.state.loadingFolderIndex === this.state.selectedFolderIndex &&
							<i className="fa fa-circle-notch fa-spin"></i>
						}
						</div>
						<div>
							{
								mails != null &&
								mails.map((mail, i) => (
									<div key={i} onClick={() => this.onClickMail(mail)}>
										{
											mail.From.map((f, fi) => (
												<span key={fi}>
													{ f.name ? f.name : f.address }
												</span>
											))
										}
										{ mail.Date }
										{ mail.Subject }

									</div>
								))
							}
						</div>
				</div>


			</div>
		);
	}

}