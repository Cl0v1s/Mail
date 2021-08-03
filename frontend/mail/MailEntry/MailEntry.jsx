import React from 'react';

import PropTypes from 'prop-types';

import { Mail as MailType } from './../../model/types';

export default class MailEntry extends React.Component {
    static propTypes = {
        mail: MailType.isRequired,
        onClick: PropTypes.func.isRequired,
    }

    state = {
        picture: true,
    }

    onError = () => {
        this.setState({ picture: false })
    }

    render() {
        console.log(this.props.mail.headers.From[0]);
        const sender = this.props.mail.headers.From[0].name || this.props.mail.headers.From[0].address;
        const picture = `http://${this.props.mail.headers.From[0].address?.split('@')[1]}/favicon.ico`;
        return (
            <div className="component-mail-entry rounded m-2 bg-white row no-gutters" onClick={this.props.onClick}>
                {
                    <div className="col-auto d-flex align-self-stretch justify-content-center picture bg-brand-secondary rounded-left">
                        <div className="align-self-center ">
                            {
                                this.state.picture
                                && <img src={picture} onError={this.onError} />
                            }
                            {
                                this.state.picture === false 
                                && <span className="text-uppercase text-big">{ sender[0] }</span>
                            }
                        </div>
                    </div>
                }
                <div className="col p-2">
                    <div className="row no-gutters align-items-start">
                        <div className="col sender">
                            { sender }
                        </div>
                        <div className="col-auto id text-small">
                            #{ this.props.mail.id}
                        </div>
                    </div>
                    <div className="row no-gutters align-items-end">
                        <div className="col subject font-weight-bold">
                            { this.props.mail.headers.Subject }
                        </div>
                        <div className="col-auto date">
                            { new Date(this.props.mail.headers.Date).toLocaleDateString() } { new Date(this.props.mail.headers.Date).toLocaleTimeString() }
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}