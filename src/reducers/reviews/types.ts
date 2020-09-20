export const SELECT_SESSION = 'SELECT_SESSION';
export const SET_SESSIONS_DATA = 'SET_SESSIONS_DATA';

export type TIdSession = string | null;

type TGrade = {
  task: string;
  items: {
    [item: string]: {
      score: number;
      comment: string;
    }
  }
};

export type TReview = {
  id: string,
  requestId: string,
  author: string,
  state: string,
  score: number,
  grade: TGrade
};

export type TSessionData = {
  id: string,
  reviews: Array<TReview>
};

export type TState = {
  sessions: Array<TSessionData>
  selected: string | null;
};

export type TSelectSession = {
  type: typeof SELECT_SESSION,
  payload: {
    id: TIdSession
  }
};

export type TSetSessionsData = {
  type: typeof SET_SESSIONS_DATA,
  payload: {
    data: Array<TSessionData>
  }
};

export type TAction = TSelectSession | TSetSessionsData;
