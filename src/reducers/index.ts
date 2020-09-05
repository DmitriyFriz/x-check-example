import { Dispatch } from 'react';
import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { History } from 'history';
import { reducer as formReducer } from 'redux-form';
// Reducers
import user from './user/reducer';
// ... other reducers

export const createRootReducer = (history: History) =>
  combineReducers({
    router: connectRouter(history),
    user,
    form: formReducer,
    // ... other reducers
  });

export type TAppStateType = ReturnType<typeof createRootReducer>;

export type TThunk<Action, Args = {}> = (
  args: Args
) => (
  dispatch: Dispatch<Action>,
  getState: () => TAppStateType
) => void;

export default createRootReducer;
