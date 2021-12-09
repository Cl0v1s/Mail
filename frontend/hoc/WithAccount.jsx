import React from 'react';
import PropTypes from 'prop-types';

import { Account, Folder } from './../model/actions';

const AccountContext = React.createContext({
  account: null,
  folders: null,
  actions: null,
});

const AccountContextProvider = ({ name, rsaKey, imap, smtp, children }) => {
  const [account, setAccount] = React.useState(null);
  const [folders, setFolders] = React.useState(null);

  const retrieveAccount = async () => {
    await Account.init(name, rsaKey, imap, smtp);
    await Account.use({ name });
    setAccount({
      name,
      imap,
      smtp,
    });
  }

  const retrieveFolders = async () => {
    const list = await Folder.list();
    setFolders(list);
  }

  React.useEffect(() => {
    retrieveAccount();
  }, [name, rsaKey, imap, smtp]);

  React.useEffect(() => {
    if (account == null) return;
    retrieveFolders();
  }, [account]);

  return <AccountContext.Provider value={{
    account,
    folders,
    actions: {
      retrieveFolders,
    },
  }}>
    {children}
  </AccountContext.Provider>;
};

AccountContextProvider.propTypes = {
  folder: Folder.isRequired,
  children: PropTypes.element.isRequired,
};

const WithAccount = (Component) => {
  const Comp = (props) => <AccountContext.Consumer>{(value) => <Component {...value} {...props} />}</AccountContext.Consumer>
  return Comp;
}

export {
  AccountContextProvider,
  WithAccount,
}
