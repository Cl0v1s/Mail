import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { list } from './../actions/Mail';

const Folders = ({folders, onClick}) => <div>
    {
        folders.map((folder, index) => <div onClick={() => onClick(folder)} style={{cursor: "pointer"}} key={index} className="p-2 border rounded my-2">
            { folder.name }
        </div>)
    }
</div>

const List = () => {
    const dispatch = useDispatch();

    const [currentFolder, setCurrentFolder] = useState(null)
    const currentAccount = useSelector((state) => state.account.current);
    const folders = useSelector((state) => state.folder.list);
    const mails = useSelector((state) => state.mail.list[currentFolder]);

    console.log(mails);

    const onClickFolder = (folder) => {
        setCurrentFolder(folder);
        dispatch(list(folder));
    }

    return <>
        <div className="row no-gutters">
            <div className="col-auto p-3">
                Bonjour { currentAccount?.name }
                <Folders folders={folders} onClick={onClickFolder} />
            </div>
            <div className="col">

            </div>
        </div>
    </>
}

export default List;