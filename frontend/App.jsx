import React from 'react';
import { HashRouter as Router } from 'react-router-dom';

import { AccountContextProvider } from './hoc/WithAccount.jsx';

import House from './views/House/House.jsx';

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



const App = () => {
  return (
    <Router>
      <AccountContextProvider
        {...account}
      >
        <House />
      </AccountContextProvider>
    </Router>
  )
};

export default App;