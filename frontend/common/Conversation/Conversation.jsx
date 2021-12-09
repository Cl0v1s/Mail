import React from 'react';
import { useParams } from 'react-router-dom';

import { WithFolder } from '../../hoc/WithFolder.jsx';

const Conversation = ({ conversations }) => {
  const params = useParams();

  const conversation = conversations.find((co) => co.id === params.conversation);

  console.log(conversation);

  return (
    <div className="component-conversation">

    </div>
  );
}

export default WithFolder(Conversation);

