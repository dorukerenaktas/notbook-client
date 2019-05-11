import { render } from 'react-dom';
import { Provider } from 'react-redux';
import React from 'reactn';
import App from './app/App';
import { Environment } from './environment';
import './i18n';
import './index.css';
import * as serviceWorker from './serviceWorker';
import store from './store';

Environment.init();

const Root = (
    <Provider store={ store }>
        <App/>
    </Provider>
);

render(Root, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
