import React from 'react';
import { Provider, useDispatch } from 'react-redux';
import store from './model/store';
import { use } from './actions/Account';
import { list } from './actions/Folder';
import List from './views/List.jsx';

import './App.scss';

import env from './env';

window.process = {
    env,
}

// Réalisé une fois au lancement de l'application
const account = {
    "name": process.env.ACCOUNT,
        "key": process.env.RSA,
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


export default class App extends React.Component {

    static async fetchInitialData(dispatch, getState) {
        // initialisation du compte
        await dispatch(use(account));
    
        // récupération des dossiers
        dispatch(list());
    }


    constructor(props) {
        super(props);

        store.dispatch(App.fetchInitialData);
    }

    render() {
        return <Provider store={store}>
            <List />
        </Provider>
    }
}
