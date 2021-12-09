import React from 'react';
import { Routes, Route, useParams, Link, useLocation, Outlet } from 'react-router-dom';

import { FolderContextProvider, WithFolder } from '../../hoc/WithFolder.jsx';
import { WithAccount } from '../../hoc/WithAccount.jsx';

import Conversations from './../../common/Conversations/Conversations.jsx';
import Conversation from './../../common/Conversation/Conversation.jsx';

const FolderRoute = ({ folders }) => {
  const params = useParams();
  return (
    <FolderContextProvider folder={params.name ? folders.find((f) => f.name === params.name) : folders[0]}>
      <Outlet />
    </FolderContextProvider>
  );
}

const FolderEntry = ({ folder }) => {
  const location = useLocation();
  return (
    <Link to={`/folder/${folder.name}`}>
      <div className={`folder-entry bg-white my-3 rounded-100 p-2 ${location.pathname === `/folder/${folder.name}` ? 'active' : ''}`} style={{ cursor: "pointer" }}>
        <div className="font-weight-bold font-family-secondary">
          {folder.name}
        </div>
        <div className="text-grey-75">
          {folder.length} mails
        </div>
      </div>
    </Link>
  )
};

const House = ({ folders, actions }) => {
  if (folders == null) return null;
  return (
    <div className="component-house d-flex">
      <div className="folder-list p-3 border-right h-100 overflow-auto">
        {
          folders.map((folder) => <FolderEntry folder={folder} />)
        }
      </div>
      <div className="mail-list w-100">
        <Routes>
          <Route path="folder" element={<FolderRoute folders={folders} />}>
            <Route index element={<Conversations />} />
            <Route path=":name" element={<Conversations />} />
            <Route path=":name/:conversation" element={<Conversation />} />
          </Route>
        </Routes>
      </div>
    </div>
  );
};

export default WithAccount(House);