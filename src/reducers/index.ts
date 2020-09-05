import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { History } from 'history';
import { reducer as formReducer } from 'redux-form';
// Reducers
import user from './user';
// ... other reducers

export const createRootReducer = (history: History) =>
  combineReducers({
    router: connectRouter(history),
    user,
    form: formReducer
    // ... other reducers
  });

export default createRootReducer;
