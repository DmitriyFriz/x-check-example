import * as types from './types';

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

    case types.CREATE_SESSION:
      return {
        ...state,
        sessions: [...state.sessions, action.payload.data],
      };

    default:
      return state;
  }
};

export default reducer;
