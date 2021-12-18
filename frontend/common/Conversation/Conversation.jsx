import React from 'react';
import { useParams } from 'react-router-dom';

import { WithFolder } from '../../hoc/WithFolder.jsx';
import { ConversationContextProvider } from '../../hoc/WithConversation.jsx';

import Threads from '../Threads/Threads.jsx';

const Conversation = ({ conversations, folder }) => {
  if (!conversations) return null;
  const params = useParams();

  const conversation = conversations.find((co) => co.id === params.conversation);

  return (
    <div className="component-conversation">
      <ConversationContextProvider conversation={conversation}>
        <Threads folder={folder} />
      </ConversationContextProvider>
    </div>
  );
}

export default WithFolder(Conversation);

