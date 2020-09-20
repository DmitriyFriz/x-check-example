import * as actions from './actions';
// Api
import Api from '../../services/XCheckApi';
// Types
import { TThunk } from '..';
import * as types from './types';

export const api = new Api();

export type Thunk = TThunk<types.TAction, undefined>;

export const setSessionsData: Thunk = () => async (dispatch, getState) => {
  const sessionsData: Array<types.TSessionData> = await api.reviews.get();
  dispatch(actions.setSessionsData(sessionsData));
};

