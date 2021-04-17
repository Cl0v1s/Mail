import React from 'react';
import PropTypes from 'prop-types';

import withAppContext from './model/withAppContext.jsx';

import FolderList from './Folders/FolderList.jsx';
import MailList from './Mails/MailList.jsx';

class Read extends React.Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
        actions: PropTypes.object.isRequired,
    }

    constructor(props) {
        super(props);

        this.state = {
            folderIndex: 0,
            mailIndex: 0,
        }
    }


    onFolderClick = async (folder) => {
        await this.props.actions.Mail.list(folder);
        this.setState({
            folderIndex: this.props.store.folders.findIndex((f) => f.name === folder.name),
        })
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
                    <div className="flex-1">
                        <MailList
                            focusIndex={this.state.mailIndex}
                            mails={this.props.store.mails}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

export default withAppContext(Read);