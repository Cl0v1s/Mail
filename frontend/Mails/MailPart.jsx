import React from 'react';
import PropTypes from 'prop-types';

import { MailBody } from './../model/types';

export default class MailPart extends React.Component {
    static propTypes = {
        mailBody: MailBody.isRequired, 
    }

    static html = (part) => <div dangerouslySetInnerHTML={{ __html: part.content }} />;

    static text = (part) => <pre>{ part.content }</pre>;

    static image = (part) => {
        const mediaType = part.headers["Content-Type"].type;
        return <img src={`data:${mediaType};base64,${part.content}`} />
    }

    static MANAGED_TYPES = {
        "text/html": MailPart.html,
        "text/plain": MailPart.text,
        "image/": MailPart.image,
    }

    constructor(props) {
        super(props);

        this.state = this.analyse(props.mailBody);
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevProps.mailBody === this.props.mailBody) return;
        this.setState(this.analyse(this.props.mailBody));
    }

    analyse(mailBody) {
        let versions = [mailBody.headers["Content-Type"].type];
        if(mailBody.headers["Content-Type"].type === "multipart/alternative") versions = mailBody.parts.map((part) => part.headers["Content-Type"].type);
        return {
            versions,
            versionIndex: versions.length - 1,
        }
    }

    content = () => {
        const contentType = this.props.mailBody.headers["Content-Type"].type;
        if(this.props.mailBody.content) {
            const filter = Object.keys(MailPart.MANAGED_TYPES).find((t) => contentType.startsWith(t));
            if(!filter) return null;
            return MailPart.MANAGED_TYPES[filter](this.props.mailBody);
        } else {
            if(contentType === "multipart/alternative") return <MailPart mailBody={this.props.mailBody.parts[this.state.versionIndex]} />;
            else if(contentType === "multipart/mixed") return this.props.mailBody.parts.map((p, index) => <MailPart key={index} mailBody={p} />)
        }
        return null;
    }

    render() {
        const content = this.content();
        if(!content) return null;
        return (
            <div className="component-mail-part">
                {
                    this.state.versions.length > 1
                    && <div>
                        {
                            this.state.versions.map((version, index) => <span key={index} className="rounded bg-gray-600 m-1 p-1 text-white cursor-pointer" onClick={() => this.setState({ versionIndex: index })}>{ version }</span>)
                        }
                    </div>
                }
                {
                    this.content()
                }
            </div>
        );
    }
}