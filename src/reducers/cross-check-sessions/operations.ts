import * as actions from './actions';
// Utils
import helper from './utils';
// Api
import Api from '../../services/XCheckApi';
// Types
import { TThunk } from '..';
import * as types from './types';

export const api = new Api();

export type Thunk = TThunk<types.TAction, string>;

export const initCrossCheck: Thunk = (id) => async (dispatch, getState) => {
  const remoteRequests: Array<{
    requests: Array<types.TRemoteRequestData>;
  }> = await api.reviewRequests.getByFilter(`id=${id}`);

  const [{ requests }] = remoteRequests;
  const requestList = helper.prepareRemoteRequestData(requests);
  const currentSession = helper.getSessionById(id, getState().crossCheckSession);

  const distribution = helper.createReviewerDistribution(
    requestList,
    currentSession.desiredReviewersAmount
  );

  dispatch(actions.updateSession({ id, state: 'CROSS_CHECK', attendees: distribution }));

  await api.crossChecks.update<types.TSessionData>(id, {
    ...currentSession,
    state: 'CROSS_CHECK',
    attendees: distribution,
  });
};

export const completeCrossCheck: Thunk = (id) => async (dispatch, getState) => {
  const remoteReviews: Array<{
    reviews: Array<types.TRemoteReviewsData>;
  }> = await api.reviews.getByFilter(`id=${id}`);

  const session = helper.getSessionById(id, getState().crossCheckSession);
  const [{ reviews }] = remoteReviews;

  session.attendees = helper.updateAllRequests(reviews, session.attendees);
  session.attendees = helper.setRequestsScores(
    session.attendees,
    session.minReviewsAmount,
    session.coefficient
  );

  dispatch(actions.updateSession({ id, state: 'COMPLETED', attendees: session.attendees }));

  await api.crossChecks.update<types.TSessionData>(id, {
    ...session,
    state: 'COMPLETED',
  });
};
