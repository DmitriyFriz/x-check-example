import * as types from './types';

const initialState: types.TState = {
  githubId: null,
  role: 'author',
  status: 'unauthorized',
};

type TState = typeof initialState;

const reducer = (state = initialState, action: types.TAction): TState => {
  switch (action.type) {
    case types.SIGN_IN:
      return {
        ...state,
        ...action.payload,
        status: 'authorized',
      };

    case types.LOG_OUT:
      return {
        ...state,
        githubId: null,
        status: 'unauthorized',
      };

    default:
      return state;
  }
};

export default reducer;
