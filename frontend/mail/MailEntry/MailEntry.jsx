import React from 'react';

import PropTypes from 'prop-types';

import './MailEntry.scss';

import { Mail as MailType } from './../../model/types';

export class MailEntry extends React.Component {
    static propTypes = {
        mail: MailType.isRequired,
        onClick: PropTypes.func.isRequired,
    }

    render() {
        const sender = this.props.mail.headers.From.name || this.props.mail.headers.From.address;
        return (
            <div className="component-mail-entry d-flex p-2" onClick={this.props.onClick}>
                <div className="col-auto">
                    <div className="picture p-2 d-flex align-items-center">
                        { sender[0].toUpperCase() }
                    </div>
                </div>
                <div className="col pl-2">
                    <div className="d-flex mb-1 align-items-start">
                        <div className="col sender">
                            { sender }
                        </div>
                        <div className="col-auto id font-size-s">
                            #{ this.props.mail.id}
                        </div>
                    </div>
                    <div className="d-flex mt-1 align-items-end">
                        <div className="col subject">
                            { this.props.mail.headers.Subject }
                        </div>
                        <div className="col-auto date font-size-xs">
                            { this.props.mail.headers.Date }
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}