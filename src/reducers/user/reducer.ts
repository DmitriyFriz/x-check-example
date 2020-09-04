import * as types from './types';

const initialState: types.TUserData = {
  githubId: null,
  role: null,
};

type TState = typeof initialState;

const reducer = (state = initialState, action: types.TAction): TState => {
  switch (action.type) {
    case types.SIGN_IN:
      return {
        ...state,
        githubId: action.payload.githubId,
        role: action.payload.role,
      };

    default:
      return state;
  }
};

export default reducer;
