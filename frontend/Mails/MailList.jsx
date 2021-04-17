import React from 'react';
import PropTypes from 'prop-types';

import { Mail as MailType } from './../model/types';
import Mail from './Mail.jsx';

export default class MailList extends React.Component {
    static propTypes = {
        mails: PropTypes.arrayOf(MailType).isRequired,
        focusIndex: PropTypes.number.isRequired,
        onMailClick: PropTypes.func.isRequired,
    }

    render() {
        return (
            <div className="component-mail-list">
                {
                    this.props.mails.map((mail, index) => <Mail key={index} mail={mail} onClick={this.props.onMailClick} focus={this.props.focusIndex === index} />)
                }
            </div>
        )
    }
}