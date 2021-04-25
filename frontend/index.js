import React from 'react';
import ReactDOM from 'react-dom';

import '@fortawesome/fontawesome-free/css/all.css';

import App from './App.jsx';

window.onload = () => {
	ReactDOM.render(React.createElement(App), document.querySelector('#mount'))
};