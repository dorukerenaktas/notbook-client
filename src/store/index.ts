import { applyMiddleware, createStore } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import root from './reducer';

const middleware = [thunk, logger];

const store = createStore(root, applyMiddleware(...middleware));

export default store;
