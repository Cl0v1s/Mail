import React from 'react';
import { Link } from 'react-router-dom';
import { v4 } from 'uuid';

import { WithConversation } from '../../hoc/WithConversation.jsx';
import MailEntry from '../MailEntry/MailEntry.jsx';


const Mailist = ({ conversation, folder }) => {
  return (
    <div className="component-mail-list">
      {
        conversation.mails
          .sort((a, b) => b.id - a.id).map((mail) => (
            <div className="m-3">
              <Link to={`/folder/${folder.name}/mail/${mail.id}`}>
                <MailEntry key={v4()} mail={mail} showSubject />
              </Link>
            </div>
          ))
      }
    </div>
  )
};

export default WithConversation(Mailist);
