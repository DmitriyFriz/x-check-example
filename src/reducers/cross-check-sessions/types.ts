export const SET_SESSIONS_DATA = 'SET_SESSIONS_DATA';
export const SELECT_SESSION = 'SELECT_SESSION';
export const CREATE_SESSION = 'CREATE_SESSION';
export const UPDATE_SESSION = 'UPDATE_SESSION';
export const DELETE_SESSION = 'DELETE_SESSION';
export const OPEN_REQUESTS_GATHERING = 'OPEN_REQUESTS_GATHERING';
export const COMPLETE_CROSS_CHECK = 'COMPLETE_CROSS_CHECK';

type TSessionState =
  | 'DRAFT'
  | 'REQUESTS_GATHERING'
  | 'CROSS_CHECK'
  | 'COMPLETED';

export type TAttendee = {
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
  desiredReviewersAmount: number;
  attendees: Array<TAttendee>;
};

export type TSetSessionsData = {
  type: typeof SET_SESSIONS_DATA;
  payload: {
    data: Array<TSessionData>;
  };
};

export type TSelectSession = {
  type: typeof SELECT_SESSION;
  payload: {
    id: string;
  };
};

export type TCreateSession = {
  type: typeof CREATE_SESSION;
  payload: {
    data: TSessionData;
  };
};

type Partial<T> = {
  [K in keyof T]?: T[K];
};

export type TUpdatedData = Partial<TSessionData> & {
  id: string;
};

export type TUpdateSession = {
  type: typeof UPDATE_SESSION;
  payload: {
    data: TUpdatedData;
  };
};

export type TDeleteSession = {
  type: typeof DELETE_SESSION;
  payload: {
    id: string;
  };
};

export type TOpenRequestGathering = {
  type: typeof OPEN_REQUESTS_GATHERING;
  payload: {
    id: string;
  };
};

export type TState = {
  sessions: Array<TSessionData>;
  selected: string | null;
};

export type TAction =
  | TSetSessionsData
  | TCreateSession
  | TUpdateSession
  | TDeleteSession
  | TSelectSession
  | TOpenRequestGathering;
