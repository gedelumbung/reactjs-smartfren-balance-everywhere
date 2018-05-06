import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

const app = document.createElement('div');

app.id = 'smartpret-everywhere';

document.body.appendChild(app);

ReactDOM.render(<App />, document.getElementById('smartpret-everywhere'));