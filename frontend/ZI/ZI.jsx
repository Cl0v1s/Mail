import React from 'react';
import PropTypes from 'prop-types';

import Conversation from './Conversation/Conversation.jsx';

import { Mail as MailType, Address as AddressType } from '../model/types';

export default class ZI extends React.Component {
    static propTypes = {
        address: AddressType.isRequired,
        mails:  PropTypes.arrayOf(MailType).isRequired,
    }

    constructor(props) {
        super(props);

        this.state = {
            conversations: this.sortConversations(this.props.mails),
        }
    }

    componentDidUpdate(oldProps, oldState) {
        if(oldProps.mails != this.props.mails) {
            this.setState({
                conversations: this.sortConversations(mails),
            })
        }
    }

    sortConversations = (mails) => {
        mails = mails.sort((a, b) => {
            const dateA = Date.parse(a.headers.Date);
            const dateB = Date.parse(b.headers.Date);
            a.headers.parsedDate = dateA;
            b.headers.parsedDate = dateB;
            return dateA - dateB;
        });
        // TODO: sort par date
        const conversations = {};
        mails.forEach((mail, index) => {
            const subject = mail.headers.Subject
                .toLowerCase()
                .replace(/re:/g, '')
                .replace(/fwd:/g, '')
                .trim();
            if(conversations[subject] == null) conversations[subject] = [];

            if(mail.headers.parsedDate === mails[index - 1]?.headers.parsedDate) index -= 1;
            conversations[subject].push({
                ...mail, 
                index,
            });
        });
        return Object.values(conversations);
    }

    render() {
        return (
            <div className="component-zi">
                <div className="address">
                    { this.props.address.name || this.props.address.address } &lt;{this.props.mails.length}&gt;
                </div>
                    <div className="d-flex">
                    { 
                        this.state.conversations.map((conv) => <div className="col">
                            <Conversation subject={conv[0].headers.Subject} mails={conv} />
                        </div>)
                    }
                </div>
            </div>
        )
    }


}