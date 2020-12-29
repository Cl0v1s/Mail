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
			selectedFolderIndex: null,
		}
	}

	async componentDidMount() {
		this.prepareFromCache();
		this.prepareFromRemote();
	}

	prepareFromCache = () => {
		const selectedFolderIndex = this.context.model.folders.findIndex(f => f.name === List.defautlFolder);
		if(selectedFolderIndex !== -1) {
			this.setState({
				selectedFolderIndex,
			})
		}
	}

	prepareFromRemote = async () => {
		await this.getFolders();
		const folders = this.context.model.folders;
		const selectedFolderIndex = folders.findIndex(f => f.name === List.defautlFolder);
		if(selectedFolderIndex !== -1) {
			this.setState({
				selectedFolderIndex,
			});
			this.getMails(selectedFolderIndex);
		}
		folders.forEach((folder, i) => {
			if(i === selectedFolderIndex) return;
			this.getMails(i);
		});
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
	}

	onSelectFolder = (index) => {
		this.setState({
			selectedFolderIndex: index,
		});
		this.getMails(index);
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
		const news = this.getHasNewMails();

		const folders = this.context.model.folders;
		const folder = this.state.selectedFolderIndex != null && this.context.model.folders[this.state.selectedFolderIndex];
		const mails = folder != null && this.context.model.mails[folder.name];
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
										{
											this.state.loadingFolderIndex === i &&
											<i className="fa fa-circle-notch fa-spin"></i>
										}
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
								mails != null &&
								mails.map((mail, i) => (
									<div key={i}>
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