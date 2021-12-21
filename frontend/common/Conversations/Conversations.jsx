import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Conversation as ConversationType, Mail, MAIL_ATTRIBUTES } from './../../model/types';
import { WithAccount } from '../../hoc/WithAccount.jsx';
import { WithFolder } from '../../hoc/WithFolder.jsx';
import { v4 } from 'uuid';


const Conversation = WithAccount(({ folder, conversation, account }) => {
  const others = conversation.people.filter((p) => p.address !== account.name);
  const isNew = conversation.mails.find((m) => m.attributes?.indexOf(MAIL_ATTRIBUTES.SEEN) === -1) != null;
  const date = new Date(conversation.mails[conversation.mails.length - 1].headers.Date);
  return (
    <Link to={`/folder/${folder.name}/conversation/${conversation.id}`}>
      <div
        className={`conversation d-flex my-3 ${isNew ? 'new' : ''} ${others.length >= 2 ? 'group' : ''}`}
      >
        <div className="color rounded-left"></div>
        <div className="content p-2 w-100 border-top border-bottom border-right rounded">
          <div className="font-weight-bold font-family-secondary">
            {others.map((o) => o.name || o.address).join(', ')}
          </div>
          <div className="text-grey-75">
            {conversation.mails.length} mail(s)
          </div>
          <div className="text-right text-grey-50">
            {date.toLocaleDateString({ year: 'numeric', month: '2-digit', date: '2-digit' })}
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