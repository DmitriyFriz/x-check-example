import * as actions from './actions';
// Service
import XCheckApiService from '../../services/XCheckApi';
// Types
import { TThunk } from '..';
import { TUserData, TAction } from './types';

const api = new XCheckApiService();

export const signIn: TThunk<TAction, TUserData> = (userData) => async (
  dispatch,
  getState
) => {
  await api.auth.signIn(userData);
  dispatch(actions.signIn(userData));
};
