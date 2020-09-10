import * as types from './types';
import { updateSession } from './utils';

const initialState: types.TState = {
  selected: null,
  sessions: [],
};

type TState = typeof initialState;

const reducer = (state = initialState, action: types.TAction): TState => {
  switch (action.type) {
    case types.SET_SESSIONS_DATA:
      return {
        ...state,
        sessions: action.payload.data,
      };

    case types.SELECT_SESSION:
      return {
        ...state,
        selected: action.payload.id,
      };

    case types.CREATE_SESSION:
      return {
        ...state,
        sessions: [...state.sessions, action.payload.data],
      };

    case types.UPDATE_SESSION:
      return {
        ...state,
        sessions: updateSession(action.payload.data, state.sessions),
      };

    case types.DELETE_SESSION:
      return {
        ...state,
        sessions: state.sessions.filter(
          (session) => session.id !== action.payload.id
        ),
      };

    case types.OPEN_REQUESTS_GATHERING:
      return {
        ...state,
        sessions: updateSession(
          {
            id: action.payload.id,
            state: 'REQUESTS_GATHERING',
          },
          state.sessions
        ),
      };

    case types.CLOSE_REQUESTS_GATHERING:
      return {
        ...state,
        sessions: updateSession(
          {
            id: action.payload.id,
            state: 'CROSS_CHECK',
          },
          state.sessions
        ),
      };

    default:
      return state;
  }
};

export default reducer;
