import * as actions from './actions';
// Types
import { TThunk } from '..';
import { TUserData, TAction } from './types';

export const signIn: TThunk<TAction, TUserData> = (userData) => async (
  dispatch,
  getState
) => {
  dispatch(actions.signIn(userData));
  // ...for example some actions and async
};
