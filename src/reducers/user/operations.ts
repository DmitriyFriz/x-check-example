import { push, RouterAction } from 'connected-react-router';
import * as actions from './actions';
// Types
import { TThunk } from '..';
import { TUserData, TAction } from './types';

export const signIn: TThunk<TAction | RouterAction, TUserData> = (
  userData
) => async (dispatch, getState) => {
  dispatch(actions.signIn(userData));
  dispatch(push('home'));
  // ...for example some actions and async
};
