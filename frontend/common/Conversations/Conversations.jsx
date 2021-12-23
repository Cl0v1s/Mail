import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Conversation as ConversationType, Mail, MAIL_ATTRIBUTES } from './../../model/types';
import { WithAccount } from '../../hoc/WithAccount.jsx';
import { WithFolder } from '../../hoc/WithFolder.jsx';
import { v4 } from 'uuid';


const Conversation = WithAccount(({ folder, conversation, account }) => {
  const others = conversation.people.filter((p) => p.address !== account.name);
  const news = conversation.mails.filter((m) => m.attributes?.indexOf(MAIL_ATTRIBUTES.SEEN) === -1);
  const date = new Date(conversation.mails[conversation.mails.length - 1].headers.Date);
  return (
    <Link to={`/folder/${folder.name}/conversation/${conversation.id}`}>
      <div
        className={`conversation rounded dp dp-light d-flex my-3 ${news.length > 0 ? 'new' : ''} ${others.length >= 2 ? 'group' : ''}`}
      >
        <div className="color rounded-left"></div>
        <div className="content p-2 w-100">
          <div className="font-weight-bold font-family-secondary">
            {others.map((o) => o.name || o.address).join(', ')}
          </div>
          <div className="text-grey-75 mt-1">
            {conversation.mails.length} mail(s)
            {
              news.length > 0 && <span>
                &nbsp;dont <span className="font-weight-bold">{news.length} non-lu(s)</span>
              </span>
            }
          </div>
          <div className="text-right text-grey-50">
            {date.toLocaleDateString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit' })}
            &nbsp;
            {date.toLocaleTimeString(undefined, { hour: 'numeric', minute: 'numeric' })}
          </div>
        </div>
      </div>
    </Link>
  );
});

Conversation.propTypes = {
  conversation: ConversationType.isRequired,
}

const Conversations = ({ folder, conversations }) => {
  if (conversations === null) return null;
  return (
    <div className="component-conversations h-100 overflow-auto p-3">
      {
        conversations.map((conversation) => <Conversation key={v4()} folder={folder} conversation={conversation} />)
      }
    </div>
  );
}

Conversations.propTypes = {
  mails: PropTypes.arrayOf(Mail).isRequired,
}

export default WithFolder(Conversations);