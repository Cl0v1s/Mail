import React from 'react';
import ReactDOM from 'react-dom';

import 'tailwindcss/dist/tailwind.css';
import '@fortawesome/fontawesome-free/css/all.css';
import List from './list/List.jsx';

window.onload = () => {
	ReactDOM.render(<List />, document.querySelector('#mount'))
};