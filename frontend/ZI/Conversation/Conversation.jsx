import React from 'react';
import PropTypes from 'prop-types';

import Mail from './../Mail/Mail.jsx';

import { Mail as MailType } from '../../model/types';

export default class Conversation extends React.Component {
    static propTypes = {
        index: PropTypes.number.isRequired,
        subject: PropTypes.string.isRequired,
        mails:  PropTypes.arrayOf(MailType).isRequired,
        color: PropTypes.string.isRequired,
    }

    constructor(props) {
        super(props);

        this.node = React.createRef();
    }

    render() {
        return (
            <div
                className={`
                    component-zi-conversation
                    border
                    border-${this.props.color}
                    rounded
                    p-2
                `}
                style={{minWidth: '200px'}}
                ref={this.node}
                data-index={this.props.index}
            >
                <div className="subject mb-3">
                    { this.props.subject } &lt;{this.props.mails.length}&gt;
                </div>
                <div>
                    { 
                        this.props.mails.map((mail) => <Mail conversationIndex={this.props.index} color={this.props.color} mail={mail}/>)
                    }
                </div>
            </div>
        )
    }


}