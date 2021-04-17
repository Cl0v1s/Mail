import React from 'react';
import PropTypes from 'prop-types';

import { Mail as MailType } from './../model/types';

import MailPart from './MailPart.jsx';

export default class MailReader extends React.Component {
    static propTypes = {
        mail: MailType.isRequired,
    }

    constructor(props) {
        super(props);

        const a = this.retrieveAttachments(this.props.mail.body);
        console.log(a);
        this.state = {
            attachments: a,
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevProps.mail === this.props.mail) return;
        
        const a = this.retrieveAttachments(this.props.mail.body);
        console.log(a);
        this.setState({
            attachments: a,
        });
    }

    retrieveAttachments = (part) => {
        if (part.parts) {
            return part.parts.map((p) => this.retrieveAttachments(p)).flat().filter((a) => a != null);
        } else {
            const filter = Object.keys(MailPart.MANAGED_TYPES).find((t) => part.headers["Content-Type"].type.startsWith(t));
            if(!filter) return part;
        }
    }



    render() {
        return (
            <div className="component-mail-reader">
                <div className="text-lg text-bold">
                    { 
                        this.props.mail.headers.From[0].name || this.props.mail.headers.From[0].address
                    }
                </div>
                <div className="flex">
                    <div className="flex-1 text-medium">
                        {
                            this.props.mail.headers.Subject
                        }
                    </div>
                    <div className="flex-initial">
                        {
                            this.props.mail.headers.Date
                        }
                    </div>
                </div>
                <div>
                        <MailPart mailBody={this.props.mail.body} />
                </div>
                
            </div>
        )
    }
}