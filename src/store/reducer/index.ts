import { loadingBarReducer } from 'react-redux-loading-bar';
import { combineReducers } from 'redux';

const root = combineReducers({
    loadingBar: loadingBarReducer
});

export default root;
