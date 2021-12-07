import React from 'react';
import { HashRouter as Router, Routes, Route, useParams } from 'react-router-dom';

import { FolderContextProvider } from './hoc/WithFolder.jsx';
import { AccountContextProvider, WithAccount } from './hoc/WithAccount.jsx';

import './App.scss';

import env from './env';

window.process = {
  env,
}

// Réalisé une fois au lancement de l'application
const account = {
  "name": process.env.ACCOUNT,
  "rsaKey": process.env.RSA,
  "imap": {
    "host": process.env.SERVER,
    "username": process.env.ACCOUNT,
    "password": process.env.PASSWORD,
  },
  "smtp": {
    "host": process.env.SERVER,
    "username": process.env.ACCOUNT,
    "password": process.env.PASSWORD,
  },
};

const FolderRoute = ({ folders }) => {
  const params = useParams();
  return (
    <FolderContextProvider folder={params.name ? folders.find((f) => f.name === params.name) : folders[0]}>
      Test direct
    </FolderContextProvider>
  );
}

const _UI = ({ folders, actions }) => {
  if (folders == null) return null;
  return (
    <Routes>
      <Route exact path="folder/:name" element={<FolderRoute folders={folders} />} />
      <Route exact path="folder" element={<FolderRoute folders={folders} />} />
    </Routes>
  );
};

const UI = WithAccount(_UI);

const App = () => {
  return (
    <Router>
      <AccountContextProvider
        {...account}
      >
        <UI />
      </AccountContextProvider>
    </Router>
  )
};

export default App;