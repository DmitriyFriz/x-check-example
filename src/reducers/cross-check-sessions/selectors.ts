import { createSelector } from 'reselect';
import { TAppStateType } from '..';
import helper from './utils';

export const getCurrentSessionId = (state: TAppStateType) => state.crossCheckSession.selected;

export const getSessions = (state: TAppStateType) => state.crossCheckSession.sessions;

export const currentSessionSelector = createSelector(
  getCurrentSessionId,
  getSessions,
  (id, sessions) => helper.getSessionById(id, sessions)
);


