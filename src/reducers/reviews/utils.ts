import * as types from './types';

interface IReviewsHelper {
  getSessionsName: (
    sessions: Array<types.TSessionData>
  ) => Array<string>
}

const reviewsHelper: IReviewsHelper = {
  getSessionsName: (sessions) => sessions.map((session) => session.id)
};

export default reviewsHelper;
