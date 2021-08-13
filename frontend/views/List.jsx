import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { list, get, getted } from './../actions/Mail';

import Mail from './../mail/MailEntry/MailEntry.jsx';

const Folders = ({folders, onClick}) => <div>
    {
        folders.map((folder, index) => <div onClick={() => onClick(folder)} style={{cursor: "pointer"}} key={index} className="p-2 border rounded my-2">
            { folder.name }
        </div>)
    }
</div>

const Mails = ({mails, onClick}) => <div>
    {
        mails.map((mail, index) => <div key={index} style={{cursor: "pointer"}}>
            <Mail mail={mail} onClick={onClick} />
        </div>)
    }
</div>

const MailContent = ({content, plain = false}) => {
    if(plain) return <pre className="p-3">{ content }</pre>;
    return <iframe sandbox srcDoc={content} />;
}

const MailPart = ({part}) => {
    console.debug('Opening mail part');
    console.debug(part);

    const readable = ["text/html", "text/plain"];
    const plain = ["text/plain"];

    const content = readable.indexOf(part.headers["Content-Type"].type) !== -1
        ? part.content
        : null;

    if(content) return <MailContent content={content} plain={plain.indexOf(part.headers["Content-Type"].type) !== -1} />
    else if(part.parts) return part.parts.map((p) => <MailPart part={p} />)

    console.error('Unsupported MIME type from part');
    console.error(part);

    return null;
}

const MailRead = ({mail}) => {
    return <div className="component-mail-read">
        <MailPart part={mail.body} />
    </div>
}

const List = () => {
    const dispatch = useDispatch();

    const [currentFolder, setCurrentFolder] = useState(null)
    const currentAccount = useSelector((state) => state.account.current);
    const folders = useSelector((state) => state.folder.list);
    const mails = useSelector((state) => state.mail.list);
    const currentMail = useSelector((state) => state.mail.current);

    const onClickFolder = (folder) => {
        setCurrentFolder(folder);
        dispatch(list(folder));
        dispatch(getted(null));
    }

    const onClickMail = (mail) => {
        console.log(mail);
        dispatch(get(mail));
    }

    return <div className="component-list">
        <div className="row no-gutters">
            <div className="col-auto folders">
                <div className="px-3 py-3 bg-brand-primary text-white">
                    { currentAccount?.name }
                </div>
                <div className="px-3">
                    <Folders folders={folders} onClick={onClickFolder} />
                </div>
            </div>
            <div className="col bg-grey-ultra-light mails">
                {
                    !currentMail && currentFolder && mails[currentFolder.name]
                    && <Mails mails={mails[currentFolder.name]} onClick={onClickMail} />
                }
                {
                    currentMail && <MailRead mail={currentMail} />
                }
            </div>
        </div>
    </div>
}

export default List;