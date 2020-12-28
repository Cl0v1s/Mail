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
		const selectedFolderIndex = this.context.model.folders.findIndex(f => f.name === List.defautlFolder);
		if(selectedFolderIndex !== -1) {
			await this.getMails(selectedFolderIndex);
		}

		this.getFolders();
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
			selectedFolderIndex: folderIndex,
			loadingFolderIndex: folderIndex,
		});
		const folder = this.context.model.folders[folderIndex];
		const ms = await Backend.getMails(folder);
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


	render() {
		const folders = this.context.model.folders;
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
									<div key={i}>
										{ folder.isNew && "Nouveau" }
										{ folder.name }
									</div>
								))
							}
					</div>
				</div>
			</div>
		);
	}

}