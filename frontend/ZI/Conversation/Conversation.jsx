import React from 'react';
import PropTypes from 'prop-types';

import Mail from './../Mail/Mail.jsx';

import { Mail as MailType } from '../../model/types';

export default class Conversation extends React.Component {
    static propTypes = {
        subject: PropTypes.string.isRequired,
        mails:  PropTypes.arrayOf(MailType).isRequired,
    }

    render() {
        return (
            <div className="component-zi-conversation">
                <div className="subject">
                    { this.props.subject } &lt;{this.props.mails.length}&gt;
                </div>
                <div  style={{ position: "relative" }}>
                    { 
                        this.props.mails.map((mail) => <Mail mail={mail} />)
                    }
                </div>
            </div>
        )
    }


}