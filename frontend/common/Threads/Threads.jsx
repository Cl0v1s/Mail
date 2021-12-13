import React from 'react';
import { v4 } from 'uuid';

import { WithConversation } from '../../hoc/WithConversation.jsx';
import MailEntry from '../MailEntry/MailEntry.jsx';


const Thread = ({ thread }) => {

  return (
    <div className="component-thread p-3">
      <div className='font-family-secondary mb-4'>
        {thread.id}
      </div>
      {
        thread.mails.map((m) => <div className="my-2">{m == null ? <div className='placeholder'></div> : <MailEntry mail={m} />} </div>)
      }
    </div>
  )
}

const Threads = ({ threads }) => {
  if (threads == null) return null;

  const sortedMails = threads
    .map((t) => t.mails.map((m) => ({ id: t.id, date: new Date(m.headers.Date), mail: m })))
    .flat()
    .sort((a, b) => a.date - b.date);


  let _threads = [];

  threads.forEach((thread) => {
    let mails = [];
    thread.mails.forEach((mail, index) => {
      console.log('----');
      console.log(mail.id);
      const toAdd = sortedMails.findIndex((m) => console.log(m.mail.id) || m.mail.id === mail.id);
      mails = [...(new Array(Math.max(0, toAdd - 1))), mail];
    });
    _threads = [..._threads, {
      id: thread.id,
      mails,
    }];
  });

  return (
    <div className="component-threads d-flex justify-content-center p-3">
      {
        _threads.map((t) => <Thread key={v4()} thread={t} />)
      }
    </div>
  );
}

export default WithConversation(Threads);