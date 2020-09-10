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

export const deleteSession = (id: string): types.TAction => ({
  type: types.DELETE_SESSION,
  payload: {
    id
  },
});

export const selectSession = (id: string): types.TAction => ({
  type: types.SELECT_SESSION,
  payload: {
    id
  },
});

export const openRequestGathering = (id: string): types.TAction => ({
  type: types.OPEN_REQUESTS_GATHERING,
  payload: {
    id
  },
});

export const closeRequestGathering = (id: string): types.TAction => ({
  type: types.CLOSE_REQUESTS_GATHERING,
  payload: {
    id
  },
});
