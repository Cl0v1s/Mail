import React, { Component } from 'react';

import Backend from './../Backend';

import MailList from './MailList.jsx';
import FolderList from './FolderList.jsx';

export default class List extends Component {

	static defaultSelectedFolder = "INBOX";

	constructor(props) {
		super(props);

		this.state = {
			...this.load(),
			loadingFolders: false,
			loadingFolderIndex: -1,
		}
	}

	load = () => {
		const raw = localStorage.getItem('List');
		if(raw) {
			const data = JSON.parse(raw);
			return data;
		}
		return {
			folders: null,
			selectedFolderIndex: null
		}
	}

	save = (state) => {
		if(
			state["folders"] 
			|| state["selectedFolderIndex"]
		) {
			localStorage.setItem('List', JSON.stringify({
				folders: this.state.folders,
				selectedFolderIndex: this.state.selectedFolderIndex,
			}));
		}
	}

	setState = (state, callback = null) => {
		super.setState(state, () => {
			this.save(state);
			if(callback) callback();
		});
	}

	async componentDidMount() {
		this.setState({
			loadingFolders: true,
		})
		const folders = await Backend.getFolders(this.state.folders);
		// updating folders list
		this.setState({
			folders,
			loadingFolders: false,
		});
		// retrieving default selected mails
		const index = folders.findIndex(f => f.name == List.defaultSelectedFolder);
		this.onChangeFolder(index);
	}

	onChangeFolder = async (index) => {
		// eventually retrieving new mails
		const folders = this.state.folders;
		// updating selectedFolders
		this.setState({
			selectedFolderIndex: index,
			loadingFolderIndex: index,
		});
		folders[index] = await Backend.getMails(folders[index]);
		this.setState({
			folders,
			loadingFolderIndex: -1,
		});
	}

	onClickMail = async (mail) => {
		const body = await Backend.getBody(this.state.folders[this.state.selectedFolderIndex], mail);
		console.log(body);
	}

	render = () => (
		<div className="component-list flex">
			<div className="folders">
				<FolderList folderSelected={this.state.selectedFolderIndex} folderLoadingIndex={this.state.loadingFolderIndex} loading={this.state.loadingFolders} folders={this.state.folders} onChangeFolder={this.onChangeFolder} />
			</div>
			<div className="mails px-2 flex-auto h-screen overflow-y-scroll">
				{
					this.state.folders
					&& this.state.folders[this.state.selectedFolderIndex]
					&& <MailList mails={this.state.folders[this.state.selectedFolderIndex].mails} onClick={this.onClickMail} />
				}
			</div>
		</div>
	);
}