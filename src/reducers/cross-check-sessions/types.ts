export const SET_SESSIONS_DATA = 'SET_SESSIONS_DATA';
export const SELECT_SESSION = 'SELECT_SESSION';
export const CREATE_SESSION = 'CREATE_SESSION';
export const UPDATE_SESSION = 'UPDATE_SESSION';
export const DELETE_SESSION = 'DELETE_SESSION';
export const OPEN_REQUESTS_GATHERING = 'OPEN_REQUESTS_GATHERING';
export const COMPLETE_CROSS_CHECK = 'COMPLETE_CROSS_CHECK';

type TSessionState = 'DRAFT' | 'REQUESTS_GATHERING' | 'CROSS_CHECK' | 'COMPLETED';

type TReviewState = 'DRAFT' | 'PUBLISHED' | 'DISPUTED' | 'ACCEPTED' | 'REJECTED' | null;

export type TRequestState = 'DRAFT' | 'PUBLISHED' | 'COMPLETED';

export type TRequestProps = {
  id: string;
  author: string;
  score: number | null;
  state: TRequestState;
};

export type TReviewer = {
  author: string;
  score: number;
  state: TReviewState;
};

export type TRemoteRequestData = {
  author: string;
  id: string;
  state: TRequestState;
};

export type TRemoteReviewsData = {
  author: string;
  id: string;
  requestId: string;
  score: number;
  state: TReviewState;
};

export type TRequest = TRequestProps & {
  reviewerOf: Array<TReviewer>;
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
  attendees: Array<TRequest>;
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

export type Partial<T> = {
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
