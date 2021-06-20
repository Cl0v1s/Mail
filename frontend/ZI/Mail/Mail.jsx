import React from 'react';
import PropTypes from 'prop-types';

import { Mail as MailType } from '../../model/types';

export default class Mail extends React.Component {
    static propTypes = {
        conversationIndex: PropTypes.number.isRequired,
        mail: MailType.isRequired,
        color: PropTypes.string.isRequired,
    }

    render() {
        return (
            <div 
                className={`
                    component-zi-mail
                    bg-${this.props.color}-light
                    border
                    border-${this.props.color}
                    rounded
                    p-2
                    mb-2
                `}
                data-index={this.props.mail.index}
                data-conversation={this.props.conversationIndex}
            >
                <div className="date">
                    { this.props.mail.headers.Date }
                </div>
                <div className="suject">
                    { this.props.mail.headers.Subject }
                </div>
                {
                    // Intégrer ici le corps du mail
                }
            </div>
        )
    }


}