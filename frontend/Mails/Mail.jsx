import React from 'react';
import PropTypes from 'prop-types';

import { Mail as MailType } from './../model/types';

export default class Mail extends React.Component {
    static propTypes = {
        mail: MailType.isRequired,
        focus: PropTypes.bool,
    }

    static defaultProps = {
        focus: false,
    }

    onClick = () => {
        this.props.onClick(this.props.mail);
    }

    render() {
        return (
            <div className={`component-mail cursor-pointer border border-gray-50 ${this.props.focus ? 'bg-gray-200' : ''}`} onClick={this.onClick}>
                <div className="text-lg font-bold">
                    { this.props.mail.headers.From[0].name ||  this.props.mail.headers.From[0].address }
                </div>
                <div className="flex">
                    <div className="font-medium flex-1">
                        { this.props.mail.headers.Subject }
                    </div>
                    <div className="flew-initial text-right">
                        { this.props.mail.headers.Date }
                    </div>
                </div>
            </div>
        )
    }
}