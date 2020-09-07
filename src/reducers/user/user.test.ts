import reducer, { types, actions } from '.';

let initialState: types.TState;
let action: types.TAction;
let newState: types.TState;

describe('User reducer: signIn action', () => {
  beforeEach(() => {
    initialState = {
      githubId: null,
      role: 'author',
      status: 'unauthorized',
    };
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

describe('User reducer: logOut action', () => {
  beforeEach(() => {
    action = actions.logOut();
    newState = reducer(initialState, action);
  });

  it('status should be unauthorized', () => {
    expect(newState.status).toBe('unauthorized');
  });

  it('githubId should be null', () => {
    expect(newState.githubId).toBe(null);
  });
});
