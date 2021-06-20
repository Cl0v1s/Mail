import React from 'react';
import PropTypes from 'prop-types';

import Conversation from './Conversation/Conversation.jsx';

import { Mail as MailType, Address as AddressType } from '../model/types';

export default class ZI extends React.Component {
    static ColorList = [
        'brand-primary',
        'brand-secondary',
        'brand-tertiary',
        'brand-quaternary',
    ]

    static propTypes = {
        address: AddressType.isRequired,
        mails:  PropTypes.arrayOf(MailType).isRequired,
    }

    constructor(props) {
        super(props);

        this.node = React.createRef();

        this.state = {
            conversations: this.sortConversations(this.props.mails),
        }
    }

    componentDidMount() {
        this.orderMailsUI();
        this.orderConversationsUI();
    }

    componentDidUpdate(oldProps, oldState) {
        if(oldProps.mails != this.props.mails) {
            this.setState({
                conversations: this.sortConversations(mails),
            }, this.orderMailsUI);
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
            conversations[subject].push({
                ...mail, 
                index,
            });
        });
        return Object.values(conversations)
            .sort((a, b) => {
                const lastMessageDateA = a[a.length - 1].headers.parsedDate;
                const lastMessageDateB = b[b.length - 1].headers.parsedDate;
                return lastMessageDateB - lastMessageDateA;
            });
    }

    orderMailsUI = () => {
        this.state.conversations.forEach((conversation) => {
            console.log('CONV -- ')
            console.log(conversation);
            for(let i = 1; i < conversation.length; i += 1) {
                const currentMailUI = document.querySelector(`.component-zi-mail[data-index="${conversation[i].index}"]`);
                console.log(currentMailUI);
                let top = 0;
                for(let u = conversation[i - 1].index + 1; u < conversation[i].index; u += 1) {
                    const mailUI = document.querySelector(`.component-zi-mail[data-index="${u}"]`);
                    console.log(mailUI);
                    top += mailUI.clientHeight;
                }
                console.log(top);
                currentMailUI.style.marginTop = `${top}px`;
            }
        })
    }

    orderConversationsUI = () => {
        console.log('ORDER -- ')
        for(let i = 0; i < this.state.conversations.length; i += 1) {
            const currentFirstMail = this.state.conversations[i][0];
            const currentConversationUI = this.node.current.querySelector(`.component-zi-conversation[data-index="${i}"]`);            
            const currentFirstMailUI = this.node.current.querySelector(`.component-zi-mail[data-index="${currentFirstMail.index}"]`);
            
            const c = currentFirstMailUI.getBoundingClientRect().y - currentConversationUI.getBoundingClientRect().y;

            const previousFirstMailUI = this.node.current.querySelector(`.component-zi-mail[data-index="${currentFirstMail.index - 1}"]`);
            if(!previousFirstMailUI) continue;
            const b = previousFirstMailUI.getBoundingClientRect().y;
            currentConversationUI.style.marginTop = `${b}px`;
        }
    }

    render() {
        return (
            <div className="component-zi" ref={this.node}>
                <div className="address">
                    { this.props.address.name || this.props.address.address } &lt;{this.props.mails.length}&gt;
                </div>
                    <div className="row no-gutters flex-nowrap">
                    { 
                        this.state.conversations.map((conv, index) => <div key={index} className="col px-3">
                            <Conversation index={index} color={ZI.ColorList[index % ZI.ColorList.length]} subject={conv[0].headers.Subject} mails={conv} />
                        </div>)
                    }
                </div>
            </div>
        )
    }


}