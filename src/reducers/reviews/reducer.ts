import * as types from './types';

const initialState: types.TState = {
  sessions: [],
  selected: '1'
};

const reducer = (state = initialState, action: types.TAction): types.TState => {
  switch (action.type) {
    case types.SELECT_SESSION:
      return {
        ...state,
        selected: action.payload.id
      };

    case types.SET_SESSIONS_DATA:
      return {
        ...state,
        sessions: action.payload.data
      };

    default:
      return state;
  }
};

export default reducer;
