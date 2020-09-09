export const SET_SESSIONS_DATA = 'SET_SESSIONS_DATA';
export const SELECT_SESSION = 'SELECT_SESSION';
export const CREATE_SESSION = 'CREATE_SESSION';
export const UPDATE_SESSION = 'UPDATE_SESSION';
export const DELETE_SESSION = 'DELETE_SESSION';
export const OPEN_REQUESTS_GATHERING = 'OPEN_REQUESTS_GATHERING';
export const CLOSE_REQUESTS_GATHERING = 'CLOSE_REQUESTS_GATHERING';
export const COMPLETE_CROSS_CHECK = 'COMPLETE_CROSS_CHECK';

type TSessionState =
  | 'DRAFT'
  | 'REQUESTS_GATHERING'
  | 'CROSS_CHECK'
  | 'COMPLETED';

type TAttendee = {
  githubId: string;
  reviewerOf: Array<string | null>;
};

export type TSessionData = {
  id: string;
  state: TSessionState;
  taskId: string;
  coefficient: number;
  startDate: number;
  endDate: number;
  discardMinScore: boolean;
  discardMaxScore: false;
  minReviewsAmount: number;
  attendees: Array<TAttendee>;
};

export type TSetSessionsData = {
  type: typeof SET_SESSIONS_DATA;
  payload: {
    data: Array<TSessionData>;
  };
};

export type TCreateSession = {
  type: typeof CREATE_SESSION;
  payload: {
    data: TSessionData;
  };
};

export type TState = {
  sessions: Array<TSessionData | null> ;
  selected: string | null;
};

export type TAction = TSetSessionsData | TCreateSession;
