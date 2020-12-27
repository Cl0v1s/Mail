import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Folder from './Folder.jsx';

export default class FolderList extends Component {
	static propTypes = {
		loading: PropTypes.bool.isRequired,
		folders: PropTypes.arrayOf(PropTypes.object).isRequired,
		onChangeFolder: PropTypes.func.isRequired,
		folderLoadingIndex: PropTypes.number,
		folderSelected: PropTypes.number,
	}

	static defaultProps = {
		folderLoadingIndex: null,
		folderSelected: null,
	}

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="component-folder-list h-screen overflow-y-scroll flex flex-col">
				<div className="tools p-2 flex items-center">
					<h2 className="text-gray-400 flex-grow">
						Dossiers
					</h2>
					<div>
						{
							this.props.loading
							&& <i className="fas fa-spin fa-circle-notch"></i>
						}
					</div>
				</div>
				{
					this.props.folders
					&& this.props.folders.map((folder, i) => <Folder selected={this.props.folderSelected === i} loading={this.props.folderLoadingIndex === i} key={i} folder={folder} onClick={() => this.props.onChangeFolder(i)} />)
				}
			</div>
		)
	}
}