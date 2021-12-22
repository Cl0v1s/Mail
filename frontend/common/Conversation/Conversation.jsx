import React from 'react';
import { useParams } from 'react-router-dom';
import { v4 } from 'uuid';

import { WithFolder } from '../../hoc/WithFolder.jsx';
import { ConversationContextProvider } from '../../hoc/WithConversation.jsx';

import Threads from '../Threads/Threads.jsx';
import MailList from '../MailList/MailList.jsx';

const Conversation = ({ conversations, folder }) => {
  if (!conversations) return null;
  const params = useParams();

  const [mode, setMode] = React.useState(Conversation.MODES.THREADS);

  const conversation = conversations.find((co) => co.id === params.conversation);

  const onChangeMode = (evt) => {
    setMode(evt.target.options[evt.target.selectedIndex].value);
  };

  return (
    <div className="component-conversation">
      <div className="p-2 bg-white border-bottom text-right">
        <select className="form-control w-auto d-inline-block" onChange={onChangeMode}>
          {
            Object.values(Conversation.MODES).map((o) => <option key={v4()} selected={mode === o} value={o}>{o}</option>)
          }
        </select>
      </div>
      <ConversationContextProvider conversation={conversation}>
        {
          mode === Conversation.MODES.THREADS && <Threads folder={folder} />
        }
        {
          mode === Conversation.MODES.TRADITIONNAL && <MailList folder={folder} />
        }
      </ConversationContextProvider>
    </div>
  );
}

Conversation.MODES = {
  THREADS: 'threads',
  TRADITIONNAL: 'traditionnel',
}

export default WithFolder(Conversation);

