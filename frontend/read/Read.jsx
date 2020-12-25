import React, { Component } from 'react';

import Backend from './../Backend';

import MailHeader from './MailHeader.jsx';
import Folder from './Folder.jsx';

export default class Read extends Component {

	static defaultSelectedFolder = "INBOX";

	constructor(props) {
		super(props);

		this.state = {
			folders: null,
			selectedFolder: null
		}
	}

	async componentDidMount() {
		const folders = await Backend.getFolders();
		// updating folders list
		this.setState({
			folders,
		});
		// retrieving default selected mails
		const index = folders.findIndex(f => f.name == Read.defaultSelectedFolder);
		this.onChangeFolder(folders[index]);
	}

	onChangeFolder = async (folder) => {
		// updating selectedFolders
		this.setState({
			selectedFolder: folder
		});
		// eventually retrieving new mails
		const folders = this.state.folders;
		const index = folders.findIndex(f => f.name == folder.name);
		folders[index] = await Backend.getMails(folders[index]);
		this.setState({
			folders,
			selectedFolder: folders[index]
		});
	}

	render = () => (
		<div className="component-read flex">
			<div className="folders mr-2 max-h-screen overflow-y-scroll">
				{
					this.state.folders
					&& this.state.folders.map((folder, i) => <Folder key={i} folder={folder} onClick={this.onChangeFolder} />)
				}
			</div>
			<div className="mails flex-auto max-h-screen overflow-y-scroll">
				{
					this.state.selectedFolder
					&& this.state.selectedFolder.mails.map((mail, i) => <MailHeader key={i} mail={mail} />)
				}
			</div>
		</div>
	);
}