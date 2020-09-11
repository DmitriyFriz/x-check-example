import * as actions from './actions';
// Utils
import {
  createReviewerDistribution,
  getAttendeeList,
  getSessionIndex,
} from './utils';
// Api
import Api from '../../services/XCheckApi';
// Types
import { TThunk } from '..';
import * as types from './types';

export const api = new Api();

export type Thunk = TThunk<types.TAction, string>;
type TRequests = Array<{ author: string }>;

export const initCrossCheck: Thunk = (id) => async (
  dispatch,
  getState
) => {
  const requests: TRequests = await api.reviewRequests.getByFilter(
    `crossCheckSessionId=${id}`
  );
  const attendeeList = getAttendeeList(requests);
  const { crossCheckSession } = getState();
  const { sessions } = crossCheckSession;
  const currentSession = sessions[getSessionIndex(id, sessions)];
  const distribution = createReviewerDistribution(
    attendeeList,
    currentSession.desiredReviewersAmount
  );
  
  dispatch(
    actions.updateSession({ id, state: 'CROSS_CHECK', attendees: distribution })
  );

  await api.crossChecks.update<types.TSessionData>(id, {
    ...currentSession,
    state: 'CROSS_CHECK',
    attendees: distribution,
  });
};
