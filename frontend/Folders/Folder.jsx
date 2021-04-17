import React from 'react';
import PropTypes from 'prop-types';

import { Folder as FolderType } from './../model/types';

export default class Folder extends React.Component {
    static propTypes = {
        folder: FolderType.isRequired,
        onClick: PropTypes.func.isRequired,
        focus: PropTypes.bool,
    }

    static defaultProps = {
        focus: false,
    }

    render() {
        return (
            <div className={`component-folder border border-gray-50 ${this.props.focus ? 'bg-gray-200' : ''}`}>
                <div className="text-lg">
                    { this.props.folder.name }
                </div>
                <div className="text-sm">
                    { this.props.folder.length }
                </div>
            </div>
        )
    }
}