import React from 'react';
import PropTypes from 'prop-types';

import withAppContext from './model/withAppContext.jsx';

import FolderList from './Folders/FolderList.jsx';

class Read extends React.Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
        actions: PropTypes.object.isRequired,
    }

    constructor(props) {
        super(props);

        this.state = {
            folderIndex: 0,
        }
    }

    componentDidMount() {
        this.props.actions.Folder.list();
    }


    onFolderClick = (folder) => {

    }

    render() {
        return (
            <div className="component-read">
                <div className="flex">
                    <div className="flex-auto">
                        <FolderList
                            onFolderClick={this.onFolderClick}
                            focusIndex={this.state.folderIndex}
                            folders={this.props.store.folders}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

export default withAppContext(Read);