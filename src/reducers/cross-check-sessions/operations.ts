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

  await api.crossChecks.updateById<types.TSessionData>(id, {
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

  const updated = helper.updateAllRequests(reviews, session.attendees);
  const withScores = helper.setRequestsScores(
    updated,
    session.minReviewsAmount,
    session.coefficient
  );

  dispatch(actions.updateSession({ id, state: 'COMPLETED', attendees: withScores }));

  await api.crossChecks.updateById<types.TSessionData>(id, {
    ...session,
    state: 'COMPLETED',
    attendees: withScores,
  });
};

export const updateRemoteData: TThunk<types.TAction, types.TAction | null> = (
  action = null
) => async (dispatch, getState) => {
  if (action) {
    dispatch(action);
  }

  const { crossCheckSession } = getState();
  const { selected } = crossCheckSession;

  if (!selected) {
    return;
  }

  await api.crossChecks.updateById<types.TSessionData>(
    selected,
    helper.getSessionById(selected, crossCheckSession)
  );
};
