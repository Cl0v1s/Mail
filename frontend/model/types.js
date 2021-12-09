import PropTypes from 'prop-types';

export const Folder = PropTypes.shape({
    name: PropTypes.string.isRequired,
    length: PropTypes.number.isRequired,
    highestmodseq: PropTypes.number.isRequired,
});


export const ContentType = PropTypes.shape({
    raw: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    charset: PropTypes.string,
    boundary: PropTypes.string,
});

export const Address = PropTypes.shape({
    name: PropTypes.string,
    address: PropTypes.string.isRequired,
});

export const MailHeader = PropTypes.shape({
    "Content-Type": ContentType.isRequired,
    Date: PropTypes.string.isRequired,
    From: PropTypes.arrayOf(Address).isRequired,
    To: PropTypes.arrayOf(Address).isRequired,
    Subject: PropTypes.string.isRequired,
});

export const MailBody = PropTypes.shape({
    headers: PropTypes.shape({
        "Content-Type": ContentType.isRequired,
    }),
    parts: PropTypes.array,
    content: PropTypes.any,
});


export const Mail = PropTypes.shape({
    id: PropTypes.string.isRequired,
    folder: PropTypes.string.isRequired,
    attributes: PropTypes.object,
    body: MailBody,
    headers: MailHeader.isRequired,
});

export const Conversation = PropTypes.shape({
  peoples: PropTypes.arrayOf(Address).isRequired,
  mails: PropTypes.arrayOf(Mail).isRequired,
})