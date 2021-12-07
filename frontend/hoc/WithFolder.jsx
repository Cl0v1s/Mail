import React from 'react';
import PropTypes from 'prop-types';

import { Mail } from './../model/actions';
import { Folder } from './../model/types';
 
const FolderContext = React.createContext({
    folder: null,
    mails: null,
    actions: null,
});

const FolderContextProvider = ({folder, children}) => {
    const [mails, setMails] = React.useState(null);

    const retrieveMails = async (filters = {}) => {
        const mails = await Mail.list(folder, filters);
        console.log(mails);
        setMails(mails);
    }

    React.useEffect(() => {
        retrieveMails();
    }, [folder.name, folder.length, folder.highestmodseq]);

    return <FolderContext.Provider value={{
        folder,
        mails,
        actions: {

        },
    }}>
        { children }
    </FolderContext.Provider>;
};

FolderContextProvider.propTypes = {
    folder: Folder.isRequired,
    children: PropTypes.element.isRequired,
};

const WithFolder = (Component) => {
    const Comp = (props) => <FolderContext.Consumer><Component {...props }/></FolderContext.Consumer>
    return Comp;
}

export { 
    FolderContextProvider,
    WithFolder,
}
