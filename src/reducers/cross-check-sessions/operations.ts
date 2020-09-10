import * as actions from './actions';
// Utils
import { createReviewerDistribution } from './utils';
// Api
import Api from '../../services/XCheckApi';
// Types
import { TThunk } from '..';
import { TAction, TSessionData } from './types';

const api = new Api();

export const closeRequestGathering: TThunk<TAction, string> = (id) => async (
  dispatch,
  getState
) => {
  dispatch(actions.updateSession({ id, state: 'CROSS_CHECK' }));

  const requests: Array<{
    author: string;
  }> = await api.reviewRequests.getByFilter(`crossCheckSessionId=${id}`);

  // dispatch(actions.updateSession({ id, state: 'CROSS_CHECK', attendees }));
};
