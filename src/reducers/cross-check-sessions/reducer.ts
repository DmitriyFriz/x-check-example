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

    default:
      return state;
  }
};

export default reducer;
