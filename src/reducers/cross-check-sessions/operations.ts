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
  const remoteRequests: Array<types.TRemoteRequestData> = await api.reviewRequests.getByFilter(
    `id=${id}`
  );
  const requestList = helper.prepareRemoteRequestData(remoteRequests);
  const { crossCheckSession } = getState();
  const { sessions } = crossCheckSession;
  const currentSession = sessions[helper.getSessionIndex(id, sessions)];
  const distribution = helper.createReviewerDistribution(
    requestList,
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

// export const completeCrossCheck: Thunk = (id) => async (dispatch, getState) => {
//   const reviews: Array<types.TRemoteReviewsData> = await api.reviews.getByFilter(
//     `id=${id}`
//   );
//   const acceptedReviews = reviews.filter((review) => review.)
//   const { crossCheckSession } = getState();
//   const { sessions } = crossCheckSession;
//   const currentSession = sessions[getSessionIndex(id, sessions)];
//   const requestWithScore = addScoreToAllRequests(reviews);

//   dispatch(
//     actions.updateSession({ id, state: 'CROSS_CHECK', attendees: distribution })
//   );

//   await api.crossChecks.update<types.TSessionData>(id, {
//     ...currentSession,
//     state: 'CROSS_CHECK',
//     attendees: distribution,
//   });
// };
