
import React from 'react';
import { useParams } from 'react-router-dom';
import { v4 } from 'uuid';

import { WithFolder } from '../../hoc/WithFolder.jsx';
import openLink from '../../helpers/openLink.js';

const READABLE = ["text/html", "text/plain"];
const PLAIN = ["text/plain"];

// Content-Transfer-Encoding
const MailText = ({ part }) => {
  const plain = PLAIN.indexOf(part.headers["Content-Type"].type) !== -1;
  const content = part.content;

  const root = React.createRef();
  if (plain) return <pre className="p-3 m-0 w-100 h-100">{content}</pre>;

  const onLoadIframe = (e) => {
    e.target.contentDocument.addEventListener("click", openLink);
  };
  return <iframe ref={root} onLoad={onLoadIframe} className="w-100 h-100 border-0" sandbox="allow-same-origin allow-popups allow-scripts" srcDoc={content} />;
}

const MailMultipartAlternatives = ({ part }) => {
  const contentTypes = part.parts.map((p) => p.headers["Content-Type"].type);
  const [alternative, setAlternative] = React.useState(contentTypes.indexOf('text/html') !== -1 ? 'text/html' : contentTypes[0]);

  const alternatives = {};
  contentTypes.forEach((ct, index) => alternatives[ct] = part.parts[index]);

  const onChange = (evt) => {
    setAlternative(evt.target.value);
  }

  return <>
    <div className="alternative border-bottom text-right p-2">
      <select className="form-control w-auto d-inline-block" onChange={onChange}>
        {
          contentTypes.map((ct) => <option key={ct} value={ct} selected={alternative === ct}>{ct}</option>)
        }
      </select>
    </div>
    <div className="flex-grow-1">
      <MailPart part={alternatives[alternative]} />
    </div>
  </>
}

const MailMultipartSigned = ({ part }) => {
  const signatureIndex = part.parts.findIndex((p) => p.headers["Content-Type"].type === "application/pgp-signature");
  const signature = part.parts[signatureIndex];
  console.log(signature);
  return <>
    {part.parts.map((p, index) => index != signatureIndex ? <MailPart key={v4()} part={p} /> : null)}
    <div className='border-top p-2 bg-white'>
      Cet e-mail a été signé avec <a onClick={openLink} target="_blank" href={`data:${signature.headers["Content-Type"]["type"]};base64,${signature.content}`} download={signature.headers["Content-Type"]["name"]}>une signature éléctronique</a>
    </div>
  </>
}

const MailPart = ({ part }) => {
  const content = READABLE.indexOf(part.headers["Content-Type"].type) !== -1
    ? part.content
    : null;

  // Si on a du contenu textuel
  if (content) return <MailText part={part} />
  else if (part.headers["Content-Type"].type === "multipart/signed") {
    return <MailMultipartSigned part={part} />
  } else if (part.parts) {
    if (part.headers["Content-Type"].type === "multipart/alternative") {
      // Si on a des alternatives
      return <MailMultipartAlternatives part={part} />
    } else {
      // Sinon on affiches les parties les unes sous les autres
      return part.parts.map((p) => <MailPart key={v4()} part={p} />)
    }
  }


  console.error('Unsupported MIME type from part');
  console.error(JSON.stringify(part));

  return null;
}

const MailRead = ({ mails, actions }) => {
  if (mails == null) return null;
  const params = useParams();

  const mail = mails.find((m) => m.id === params.id);
  if (mail.body == null) {
    actions.retrieveMailsBody([mail]);
  }

  return <div className="component-mail-read w-100 h-100 border-0 d-flex flex-column">
    {
      mail.body == null ? 'Chargement...' : <MailPart part={mail.body} />
    }

  </div>
}

export default WithFolder(MailRead);