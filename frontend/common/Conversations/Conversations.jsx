import React from 'react';
import PropTypes from 'prop-types';
import { Conversation as ConversationType, Mail } from './../../model/types';
import { WithAccount } from '../../hoc/WithAccount.jsx';


const Conversation = WithAccount(({ conversation, account }) => {
  const others = conversation.people.filter((p) => p.address !== account.name);
  return (
    <div className={`conversation d-flex my-3 ${others.length >= 2 ? 'group' : ''}`}>
      <div className="color rounded-left"></div>
      <div className="content pl-2 py-2 w-100 border-top border-bottom border-right rounded">
        <div className="font-weight-bold font-family-secondary">
          {others.map((o) => o.name || o.address).join(', ')}
        </div>
        <div className="text-grey-75">
          {conversation.mails.length} mail(s)
        </div>
      </div>
    </div>
  );
});

Conversation.propTypes = {
  conversation: ConversationType.isRequired,
}

const Conversations = ({ mails }) => {
  if (mails === null) return null;
  const conversationsAbstract = {};

  mails.forEach(mail => {
    const everyone = [...mail.headers.From, ...mail.headers.To]
      .sort((a, b) => a.address.localeCompare(b.address));
    const signature = everyone
      .map((a) => a.address).join('-');
    if (conversationsAbstract[signature] == null) {
      conversationsAbstract[signature] = {
        people: everyone,
        mails: [],
      }
    }
    conversationsAbstract[signature].mails.push(mail);
  });

  // mails (and so conversation) are already sorted from older to newer. Let's reverse that.
  const conversations = Object.values(conversationsAbstract).reverse();

  return (
    <div className="component-conversations h-100 overflow-auto p-3">
      {
        conversations.map((conversation) => <Conversation conversation={conversation} />)
      }
    </div>
  );
}

Conversations.propTypes = {
  mails: PropTypes.arrayOf(Mail).isRequired,
}

export default Conversations;