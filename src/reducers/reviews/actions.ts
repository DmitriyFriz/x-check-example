import * as types from './types';

export const selectTask = (id: types.TIdSession): types.TAction => ({
  type: types.SELECT_SESSION,
  payload: {
    id
  }
});

export const setSessionsData = (data: Array<types.TSessionData>): types.TAction => ({
  type: types.SET_SESSIONS_DATA,
  payload: {
    data
  }
});
