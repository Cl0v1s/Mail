
import React from 'react';

const MailContent = ({content, plain = false}) => {
    const root = React.createRef();
    /*
    TODO: gérer la navigation
    React.useEffect(() => {
        root.current.contentWindow.onload = function(evt) {
            Array.from(evt.target.querySelectorAll('a')).forEach((a) => {
                console.log(a);
                a.target = "_blank";
            });
        };
    }, []);
    */
    if(plain) return <pre className="p-3 m-0 w-100 h-100">{ content }</pre>;
    return <iframe ref={root} className="w-100 h-100 border-0" sandbox="allow-same-origin" srcDoc={content} />;
}

const MailAlternatives = ({part}) => {
    const contentTypes = part.parts.map((p) => p.headers["Content-Type"].type);
    const [alternative, setAlternative] = React.useState(contentTypes.indexOf('text/html') !== -1 ? 'text/html' : contentTypes[0]);

    const alternatives = {};
    contentTypes.forEach((ct, index) => alternatives[ct] = part.parts[index]);

    const onChange = (evt) => {
        setAlternative(evt.target.value);
    }

    return <div className="position-relative">
        <MailPart part={alternatives[alternative]} />
        <div className="alternative position-absolute rounded bg-grey-light mx-4 my-3 p-2" style={{bottom: 0, right: 0}}>
            <select className="form-control w-auto d-inline-block" onChange={onChange}>
                {
                    contentTypes.map((ct) => <option key={ct} value={ct} selected={alternative === ct}>{ct}</option>)
                }
            </select>
        </div>
    </div>
}

const MailPart = ({part}) => {
    console.debug('Opening mail part');
    console.debug(part);

    const readable = ["text/html", "text/plain"];
    const plain = ["text/plain"];

    const content = readable.indexOf(part.headers["Content-Type"].type) !== -1
        ? part.content
        : null;

    let result = null;

    // Si on a du contenu textuel
    if(content) return <MailContent content={content} plain={plain.indexOf(part.headers["Content-Type"].type) !== -1} />
    else if(part.parts) {
        if(part.headers["Content-Type"].type === "multipart/alternative") {
            // Si on a des alternatives
            return <MailAlternatives part={part} />
        } else {
            // Sinon on affiches les parties les unes sous les autres
            return part.parts.map((p) => <MailPart part={p} />)
        }
    }

    if(result) return <section>{ result }</section>;

    console.error('Unsupported MIME type from part');
    console.error(part);

    return null;
}

const MailRead = ({mail}) => {
    return <div className="component-mail-read w-100 h-100 border-0">
        <MailPart part={mail.body} />
    </div>
}

export default MailRead;