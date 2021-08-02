import { configureStore } from '@reduxjs/toolkit';
import AccountReducer from './../actions/Account';
import FolderReducer from './../actions/Folder';
import MailReducer from './../actions/Mail';


const asyncMiddleware = storeAPI => next => action => {  
    if (typeof action === 'function') {   
        return action(storeAPI.dispatch, storeAPI.getState) 
    }
    return next(action);
}

export default configureStore({
    reducer: {
        account: AccountReducer,
        folder: FolderReducer,
        mail: MailReducer,
    },
    middleware: [asyncMiddleware]
});