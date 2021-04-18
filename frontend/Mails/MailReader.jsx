import React from 'react';
import PropTypes from 'prop-types';

import { Mail as MailType } from './../model/types';

import MailPart from './MailPart.jsx';

export default class MailReader extends React.Component {
    static propTypes = {
        mail: MailType.isRequired,
    }

    static b64toBlob = (b64Data, contentType='', sliceSize=512) => {
        const byteCharacters = atob(b64Data);
        const byteArrays = [];
      
        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
          const slice = byteCharacters.slice(offset, offset + sliceSize);
      
          const byteNumbers = new Array(slice.length);
          for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
          }
      
          const byteArray = new Uint8Array(byteNumbers);
          byteArrays.push(byteArray);
        }
      
        const blob = new Blob(byteArrays, {type: contentType});
        return blob;
    }

    constructor(props) {
        super(props);

        this.state = {
            attachments: this.initAttachments(),
        }
    }

    componentWillUnmount() {
        this.freeAttachments(this.state.attachments);
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevProps.mail !== this.props.mail) {
            this.freeAttachments(this.state.attachments);
            this.setState({
                attachments: this.initAttachments(),
            })
        }
    }

    initAttachments = () => {
        const aats = this.retrieveAttachments(this.props.mail.body)
            .filter((a) => a != null)
            .map((a) => {
                const blob = MailReader.b64toBlob(a.content, "application/octet-stream");
                const match = a.headers["Content-Disposition"].match(/filename=("|')?([^"']*)("|')?/);
                const name = (
                    match
                    ? match[2]
                    : "attachment"
                ).replace('.pgp', '');
                return {
                    filename: name,
                    url: URL.createObjectURL(blob),
                }
            });
        console.log(aats);
        return aats;
    }

    freeAttachments = (attachments) => {
        attachments.forEach((a) => URL.revokeObjectURL(a.url));
    }

    retrieveAttachments = (part) => {
        if (part.parts) {
            return part.parts.map((p) => this.retrieveAttachments(p)).flat();
        }
        const filter = Object.keys(MailPart.MANAGED_TYPES).find((t) => part.headers["Content-Type"].type.startsWith(t));
        if(!filter) return [part];
        return [];
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
                <div>
                        {
                            this.state.attachments.map((at, index) => <a key={index} download={at.filename} href={at.url}>
                                    {
                                        at.filename
                                    }
                                </a>
                            )
                        }
                </div>
                
            </div>
        )
    }
}