import * as types from './types';

export const setSessionsData = (
  data: Array<types.TSessionData>
): types.TAction => ({
  type: types.SET_SESSIONS_DATA,
  payload: {
    data,
  },
});

export const createSession = (data: types.TSessionData): types.TAction => ({
  type: types.CREATE_SESSION,
  payload: {
    data,
  },
});

export const updateSession = (data: types.TUpdatedData): types.TAction => ({
  type: types.UPDATE_SESSION,
  payload: {
    data
  },
});
