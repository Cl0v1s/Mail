import React from 'react';
import { Link } from 'react-router-dom';

import { WithConversation } from '../../hoc/WithConversation.jsx';
import MailEntry from '../MailEntry/MailEntry.jsx';

const Threads = ({ threads, folder }) => {
  if (threads == null) return null;

  const sortedMails = threads
    .map((t, threadIndex) => t.mails.map((m) => ({ threadIndex, id: t.id, date: new Date(m.headers.Date), mail: m })))
    .flat()
    .sort((a, b) => a.date - b.date);

  const lines = [];
  do {
    let line = new Array(threads.length).fill(null);
    const current = sortedMails.shift();
    // Mails (d'autres threads !!) à la même date
    const similars = sortedMails.filter((s) => s.date.getTime() === current.date.getTime());
    sortedMails.splice(0, similars.length);

    line[current.threadIndex] = current;
    similars.forEach((s) => line[s.threadIndex] = s);

    lines.push(line);
  } while (sortedMails.length > 0);

  return (
    <div className="component-threads p-3">
      <div className="subjects bg-white d-flex align-items-end">
        {
          threads.map((t) => <div className="cell border-bottom mx-3 my-3 pb-3 font-family-secondary">{t.id}</div>)
        }
      </div>
      {
        lines.map((line) => (
          <div className="d-flex my-2">
            {
              line.map((m) => m == null ?
                <div className="cell mx-3 my-2"></div>
                : (
                  <div className="cell mx-3 my-2">
                    <Link to={`/folder/${folder.name}/mail/${m.mail.id}`}>
                      <MailEntry mail={m.mail} />
                    </Link>
                  </div>
                )
              )
            }
          </div>
        ))
      }
    </div >
  );
}

export default WithConversation(Threads);