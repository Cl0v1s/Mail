import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { list } from './../actions/Mail';

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

const List = () => {
    const dispatch = useDispatch();

    const [currentFolder, setCurrentFolder] = useState(null)
    const currentAccount = useSelector((state) => state.account.current);
    const folders = useSelector((state) => state.folder.list);
    const mails = useSelector((state) => state.mail.list);

    const onClickFolder = (folder) => {
        setCurrentFolder(folder);
        dispatch(list(folder));
    }

    return <>
        <div className="row no-gutters">
            <div className="col-auto">
                <div className="px-3 pt-3 pb-4 bg-brand-primary text-white">
                    { currentAccount?.name }
                </div>
                <div className="px-3">
                    <Folders folders={folders} onClick={onClickFolder} />
                </div>
            </div>
            <div className="col bg-grey-ultra-light">
                {
                    currentFolder && mails[currentFolder.name]
                    && <Mails mails={mails[currentFolder.name]} />
                }
            </div>
        </div>
    </>
}

export default List;