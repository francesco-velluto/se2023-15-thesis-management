import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';
import favicon from './images/favicon.png';


const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
const link = document.createElement('link');
link.type = 'image/png';
link.rel = 'icon';
link.href = favicon;
document.head.appendChild(link);