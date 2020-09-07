import reducer, { types, actions } from '.';

const initialState: types.TState = {
  githubId: null,
  role: 'author',
  status: 'unauthorized',
};
let action: types.TAction;
let newState: types.TState;

describe('User reducer: signIn action', () => {
  beforeEach(() => {
    action = actions.signIn({
      githubId: 'Jack',
      role: 'student',
    });
    newState = reducer(initialState, action);
  });

  it('status should be authorized', () => {
    expect(newState.status).toBe('authorized');
  });

  it('githubId should changed', () => {
    expect(newState.githubId).toBe('Jack');
    expect(newState.githubId).not.toBe(null);
  });

  it('role should changed', () => {
    expect(newState.role).toBe('student');
  });
});
