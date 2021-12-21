
import React from 'react';
import { useParams } from 'react-router-dom';

import { WithFolder } from '../../hoc/WithFolder.jsx';

const MailContent = ({ content, plain = false }) => {
  const root = React.createRef();
  if (plain) return <pre className="p-3 m-0 w-100 h-100">{content}</pre>;

  const onClickIframe = (e) => {
    if (e.target.nodeName !== 'A' || e.target.target !== '_blank') return;
    e.preventDefault();
    window.open(e.target.href, '_blank');
  }

  const onLoadIframe = (e) => {
    e.target.contentDocument.addEventListener("click", onClickIframe);
  };

  return <iframe ref={root} onLoad={onLoadIframe} className="w-100 h-100 border-0" sandbox="allow-same-origin allow-popups allow-scripts" srcDoc={content} />;
}

const MailAlternatives = ({ part }) => {
  const contentTypes = part.parts.map((p) => p.headers["Content-Type"].type);
  const [alternative, setAlternative] = React.useState(contentTypes.indexOf('text/html') !== -1 ? 'text/html' : contentTypes[0]);

  const alternatives = {};
  contentTypes.forEach((ct, index) => alternatives[ct] = part.parts[index]);

  const onChange = (evt) => {
    setAlternative(evt.target.value);
  }

  return <div className="h-100 d-flex flex-column">
    <div className="alternative rounded border-bottom text-right p-2">
      <select className="form-control w-auto d-inline-block" onChange={onChange}>
        {
          contentTypes.map((ct) => <option key={ct} value={ct} selected={alternative === ct}>{ct}</option>)
        }
      </select>
    </div>
    <div className="flex-grow-1">
      <MailPart part={alternatives[alternative]} />
    </div>
  </div>
}

const MailPart = ({ part }) => {
  console.debug('Opening mail part');
  console.debug(part);

  const readable = ["text/html", "text/plain"];
  const plain = ["text/plain"];

  const content = readable.indexOf(part.headers["Content-Type"].type) !== -1
    ? part.content
    : null;

  let result = null;

  // Si on a du contenu textuel
  if (content) return <MailContent content={content} plain={plain.indexOf(part.headers["Content-Type"].type) !== -1} />
  else if (part.parts) {
    if (part.headers["Content-Type"].type === "multipart/alternative") {
      // Si on a des alternatives
      return <MailAlternatives part={part} />
    } else {
      // Sinon on affiches les parties les unes sous les autres
      return part.parts.map((p) => <MailPart part={p} />)
    }
  }

  if (result) return <section>{result}</section>;

  console.error('Unsupported MIME type from part');
  console.error(part);

  return null;
}

const MailRead = ({ mails, actions }) => {
  if (mails == null) return null;
  const params = useParams();

  const mail = mails.find((m) => m.id === params.id);
  if (mail.body == null) {
    actions.retrieveMailsBody([mail]);
  }

  return <div className="component-mail-read w-100 h-100 border-0">
    {
      mail.body == null ? 'Chargement...' : <MailPart part={mail.body} />
    }

  </div>
}

export default WithFolder(MailRead);