import React from 'react';
import PropTypes from 'prop-types';

import { WithFolder } from './WithFolder.jsx';
import { Conversation } from './../model/types';

const groupByThreads = (mails) => {
  const threads = {};

  mails.forEach((mail) => {
    const subject = mail.headers.Subject.replace(/^Re:/, '').trim();
    if (threads[subject] == null) threads[subject] = {
      id: subject,
      mails: [],
      firstMessageDate: new Date(mail.headers.Date),
    };
    threads[subject].mails.push(mail);
  });

  return Object.values(threads)
    .sort((a, b) => a.firstMessageDate - b.firstMessageDate);
};

const ConversationContext = React.createContext({
  conversation: null,
  threads: null,
  actions: null,
});

const _ConversationContextProvider = ({ conversation, children, actions }) => {
  const [threads, setThreads] = React.useState(null);

  const retrieveMailsBody = async () => {
    const toRetrieve = conversation.mails.filter((m) => m.body == null);
    if (toRetrieve.length <= 0) return;
    actions.retrieveMailsBody(toRetrieve);
  }

  React.useEffect(() => {
    retrieveMailsBody();
    setThreads(groupByThreads(conversation.mails));
  }, [conversation.id, conversation.mails]);

  return <ConversationContext.Provider value={{
    conversation,
    threads,
    actions: {

    }
  }}>
    {children}
  </ConversationContext.Provider>;
};

_ConversationContextProvider.propTypes = {
  conversation: Conversation.isRequired,
  children: PropTypes.element.isRequired,
};

const WithConversation = (Component) => {
  const Comp = (props) => <ConversationContext.Consumer>{(value) => <Component {...value} {...props} />}</ConversationContext.Consumer>
  return Comp;
}

const ConversationContextProvider = WithFolder(_ConversationContextProvider);

export {
  ConversationContextProvider,
  WithConversation,
}