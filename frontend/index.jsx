import React from 'react';
import ReactDOM from 'react-dom';

import 'tailwindcss/dist/tailwind.css';
import '@fortawesome/fontawesome-free/css/all.css';
import Read from './read/Read.jsx';

window.onload = () => {
	ReactDOM.render(<Read />, document.querySelector('#mount'))
};