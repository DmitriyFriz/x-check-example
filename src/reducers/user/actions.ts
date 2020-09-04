import * as types from './types';

export const signIn = (userData: types.TUserData): types.TSignIn => ({
  type: 'SIGN_IN',
  payload: userData,
});
