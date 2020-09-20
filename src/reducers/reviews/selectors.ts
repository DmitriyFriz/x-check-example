import { createSelector } from 'reselect';
import { TAppStateType } from '..';
import helper from './utils';


export const getCurrentSessionId = (state: TAppStateType) => state.reviews.selected;


export const getSessions = (state: TAppStateType) => state.reviews.sessions;


export const getSessionsName = createSelector(
  getSessions,
  (sessions) => helper.getSessionsName(sessions)
);
