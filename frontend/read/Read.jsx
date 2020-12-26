import React, { Component } from 'react';

import Backend from './../Backend';

import MailList from './MailList.jsx';
import Folder from './Folder.jsx';

export default class Read extends Component {

	static defaultSelectedFolder = "INBOX";

	constructor(props) {
		super(props);

		this.state = this.load();
	}

	load = () => {
		const raw = localStorage.getItem('Read');
		if(raw) {
			const data = JSON.parse(raw);
			return data;
		}
		return {
			folders: null,
			selectedFolder: null
		}
	}

	save = () => {
		localStorage.setItem('Read', JSON.stringify(this.state));
	}

	setState = (state, callback = null) => {
		super.setState(state, () => {
			this.save();
			if(callback) callback();
		});
	}

	async componentDidMount() {
		const folders = await Backend.getFolders(this.state.folders);
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
			<div className="folders max-h-screen overflow-y-scroll flex flex-col">
				{
					this.state.folders
					&& this.state.folders.map((folder, i) => <Folder key={i} folder={folder} onClick={this.onChangeFolder} />)
				}
			</div>
			<div className="mails px-2 flex-auto h-screen overflow-y-scroll">
				{
					this.state.selectedFolder
					&& <MailList mails={this.state.selectedFolder.mails} />
				}
			</div>
		</div>
	);
}