import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { History } from 'history';
// Reducers
import user from './user';
// ... other reducers

export const createRootReducer = (history: History) =>
  combineReducers({
    router: connectRouter(history),
    user,
    // ... other reducers
  });

export default createRootReducer;
