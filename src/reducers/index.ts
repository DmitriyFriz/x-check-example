import { Dispatch } from 'react';
import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { History } from 'history';
// Reducers
import user from './user/reducer';
import crossCheckSession from './cross-check-sessions/reducer';
// ... other reducers

export const createRootReducer = (history: History) =>
  combineReducers({
    router: connectRouter(history),
    user,
    crossCheckSession,
    // ... other reducers
  });

export type TAppStateType = ReturnType<ReturnType<typeof createRootReducer>>;

export type TThunk<Action, Args = {}> = (
  args: Args
) => (
  dispatch: Dispatch<Action>,
  getState: () => TAppStateType
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
) => Promise<any>;

export default createRootReducer;
