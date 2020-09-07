import * as types from './types';

export const signIn = (userData: types.TUserData): types.TAction => ({
  type: 'SIGN_IN',
  payload: userData,
});

export const logOut = (): types.TAction => ({
  type: 'LOG_OUT',
});
