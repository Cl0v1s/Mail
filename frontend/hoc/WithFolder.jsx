import React from 'react';
import PropTypes from 'prop-types';

import { Mail } from './../model/actions';
import { Folder } from './../model/types';

const groupByConversations = (mails) => {
  const conversationsAbstract = {};

  mails.forEach(mail => {
    const everyone = [...mail.headers.From, ...mail.headers.To]
      .sort((a, b) => a.address.localeCompare(b.address));
    const signature = everyone
      .map((a) => a.address).join('|');
    if (conversationsAbstract[signature] == null) {
      conversationsAbstract[signature] = {
        id: signature,
        people: everyone,
        mails: [],
      }
    }
    conversationsAbstract[signature].mails.push(mail);
  });

  // mails (and so conversation) are already sorted from older to newer. Let's reverse that.
  return Object.values(conversationsAbstract).reverse();
}


const FolderContext = React.createContext({
  folder: null,
  mails: null,
  conversations: null,
  actions: null,
});

const FolderContextProvider = ({ folder, children }) => {
  const [mails, setMails] = React.useState(null);
  const [conversations, setConversations] = React.useState(null);

  const retrieveMails = async (filters = {}) => {
    const mails = await Mail.list(folder, filters);
    setMails(mails);
  }

  const retrieveMailsBody = async (mailsToRetrieve) => {
    const results = await Promise.all(
      mailsToRetrieve.map((m) => Mail.get(m))
    )

    setMails(mails.map((m) => {
      const concerned = results.find((r) => m.id === r.id);
      if (!concerned) return m;
      return concerned;
    }));
  }

  React.useEffect(() => {
    retrieveMails();
  }, [folder.name, folder.length, folder.highestmodseq]);

  React.useEffect(() => {
    if (mails == null) return;
    setConversations(groupByConversations(mails));
  }, [mails])

  return <FolderContext.Provider value={{
    folder,
    mails,
    conversations,
    actions: {
      retrieveMails,
      retrieveMailsBody,
    },
  }}>
    {children}
  </FolderContext.Provider>;
};

FolderContextProvider.propTypes = {
  folder: Folder.isRequired,
  children: PropTypes.element.isRequired,
};

const WithFolder = (Component) => {
  const Comp = (props) => <FolderContext.Consumer>{(value) => <Component {...value} {...props} />}</FolderContext.Consumer>
  return Comp;
}

export {
  FolderContextProvider,
  WithFolder,
}
