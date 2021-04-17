import React from 'react';
import PropTypes from 'prop-types';

import { Folder as FolderType } from './../model/types';
import Folder from './Folder.jsx';

export default class FolderList extends React.Component {
    static propTypes = {
        folders: PropTypes.arrayOf(FolderType).isRequired,
        onFolderClick: PropTypes.func.isRequired,
        focusIndex: PropTypes.number.isRequired,
    }


    render() {
        return (
            <div className="component-folder-list">
                {
                    this.props.folders.map((folder, index) => <Folder key={index} folder={folder} focus={this.props.focusIndex === index} onClick={this.props.onFolderClick} />)
                }
            </div>
        )
    }
}