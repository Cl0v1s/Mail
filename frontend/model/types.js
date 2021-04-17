import PropTypes from 'prop-types';

export const Folder = PropTypes.shape({
    name: PropTypes.string.isRequired,
    length: PropTypes.number.isRequired,
    highestmodseq: PropTypes.number.isRequired,
});