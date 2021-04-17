import React from 'react';
import PropTypes from 'prop-types';

import withAppContext from './model/withAppContext.jsx';

import FolderList from './Folders/FolderList.jsx';
import MailList from './Mails/MailList.jsx';
import MailReader from './Mails/MailReader.jsx';

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
            mailToRead: this.props.store.mails[0],
        }
    }


    onFolderClick = async (folder) => {
        await this.props.actions.Mail.list(folder);
        this.setState({
            folderIndex: this.props.store.folders.findIndex((f) => f.name === folder.name),
        })
    }

    onMailClick = async (mail) => {
        await this.props.actions.Mail.get(mail);
        const index = this.props.store.mails.findIndex((m) => m.id === mail.id && m.folder === mail.folder);
        this.setState({
            mailToRead: this.props.store.mails[index],
            mailIndex: index,
        })
    }

    render() {
        return (
            <div className="component-read">
                <div className="flex">
                    <div className="">
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
                            onMailClick={this.onMailClick}
                        />
                    </div>
                    <div className="flex-1">
                        {
                            this.state.mailToRead
                            && <MailReader
                                mail={this.state.mailToRead}
                            />
                        }

                    </div>
                </div>
            </div>
        )
    }
}

export default withAppContext(Read);