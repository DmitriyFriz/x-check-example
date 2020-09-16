import * as types from './types';
import helper from './utils';

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
        sessions: helper.updateSession(action.payload.data, state.sessions),
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
        sessions: helper.updateSession(
          {
            id: action.payload.id,
            state: 'REQUESTS_GATHERING',
          },
          state.sessions
        ),
      };

    default:
      return state;
  }
};

export default reducer;
