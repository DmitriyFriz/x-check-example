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

const api = new Api();

type Thunk = TThunk<types.TAction, string>;
type TRequests = Array<{ author: string }>;

export const closeRequestGathering: Thunk = (id) => async (
  dispatch,
  getState
) => {
  const { crossCheckSession } = getState();
  const { sessions } = crossCheckSession;
  const currentSession = sessions[getSessionIndex(id, sessions)];
  const requests: TRequests = await api.reviewRequests.getByFilter(
    `crossCheckSessionId=${id}`
  );
  const attendeeList = getAttendeeList(requests);
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
