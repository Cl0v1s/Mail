import React from 'react';

import { Mail as MailType } from '../../model/types';

export default class Mail extends React.Component {
    static propTypes = {
        mail: MailType.isRequired,
    }

    render() {
        return (
            <div className="component-zi-mail" style={{ position: "absolute", top: this.props.mail.index * 50 }}>
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