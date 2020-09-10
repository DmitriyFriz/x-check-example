import reducer, { types, actions } from '.';
import {
  getSessionIndex,
  addReviewerToAttendee,
  createReviewerDistribution,
} from './utils';

const initState: types.TState = {
  sessions: [],
  selected: null,
};

const data: Array<types.TSessionData> = [
  {
    id: 'rss2020Q3react',
    state: 'DRAFT',
    taskId: 'simple-task-v1',
    coefficient: 0.7,
    startDate: 12222121,
    endDate: 12225121,
    discardMinScore: true,
    discardMaxScore: false,
    minReviewsAmount: 1,
    attendees: [],
  },
  {
    id: 'rss2020Q3Angular',
    state: 'CROSS_CHECK',
    taskId: 'simple-task-v3',
    coefficient: 0.5,
    startDate: 22222121,
    endDate: 22225121,
    discardMinScore: true,
    discardMaxScore: false,
    minReviewsAmount: 2,
    attendees: [],
  },
];

describe('Cross-check-session reducer', () => {
  it('setSessionsData action should set a data', () => {
    const action = actions.setSessionsData(data);
    const state = initState;
    const newState = reducer(state, action);

    expect(newState.sessions).toEqual(data);
    expect(newState.selected).toBe(initState.selected);
  });

  it('selectSession action should add id session to "selected" key', () => {
    const id = 'rss2020Q3react';
    const action = actions.selectSession(id);
    const state = initState;
    const newState = reducer(state, action);

    expect(newState.selected).not.toBeNull();
    expect(newState.selected).toBe(id);
  });

  it('createSession action should add a new session to sessions data', () => {
    const newSession = data[0];
    const action = actions.createSession(newSession);
    const newState = reducer(initState, action);

    expect(newState.sessions.length).toBeGreaterThan(initState.sessions.length);
    expect(
      newState.sessions.find((session) => session?.id === 'rss2020Q3react')
    ).toEqual(newSession);
  });

  it('updateSession action should update a session data by id', () => {
    const inputData: types.TUpdatedData = {
      id: 'rss2020Q3Angular',
      state: 'COMPLETED',
      coefficient: 0.8,
      minReviewsAmount: 3,
    };
    const action = actions.updateSession(inputData);
    const state = { ...initState, sessions: data };
    const newState = reducer(state, action);
    const indexOfUpdatedSession = getSessionIndex(
      'rss2020Q3Angular',
      newState.sessions
    );

    expect(newState.sessions[indexOfUpdatedSession]).toEqual({
      ...state.sessions[indexOfUpdatedSession],
      ...inputData,
    });
  });

  it('deleteSession action should remove a session by id', () => {
    const id = 'rss2020Q3Angular';
    const action = actions.deleteSession(id);
    const state = { ...initState, sessions: data };
    const newState = reducer(state, action);
    const index = getSessionIndex(id, newState.sessions);

    expect(index).toBe(-1);
    expect(newState.sessions).toEqual(
      data.filter((session) => session.id !== id)
    );
  });

  it('openRequestGathering action should change session state to "REQUEST_GATHERING"', () => {
    const id = 'rss2020Q3react';
    const action = actions.openRequestGathering(id);
    const state = { ...initState, sessions: data };
    const newState = reducer(state, action);
    const index = getSessionIndex(id, newState.sessions);

    expect(newState.sessions[index].state).toBe('REQUESTS_GATHERING');
    expect(newState.sessions[index]).toEqual({
      ...data[index],
      state: 'REQUESTS_GATHERING',
    });
  });
});

const list = ['jack', 'john', 'boris-britva', 'macKlein', 'rediska'];
jest.mock('lodash.shuffle', () =>
  jest
    .fn()
    .mockReturnValue(['john', 'jack', 'macKlein', 'boris-britva', 'rediska'])
);

describe('Cross-check-session utils: createReviewerDistribution', () => {
  const reviewers = addReviewerToAttendee(list, 2)([], 'jack', 0);
  let distribution = createReviewerDistribution(list, 1);

  it('addReviewerToAttendee should add reviewers to an attendee', () => {
    expect(reviewers).toEqual([
      { githubId: 'jack', reviewerOf: ['john', 'boris-britva'] },
    ]);
  });

  it('createReviewerDistribution should create reviewer distribution per 1 reviewers amount', () => {
    expect(distribution).toEqual([
      { githubId: 'john', reviewerOf: ['jack'] },
      { githubId: 'jack', reviewerOf: ['macKlein'] },
      { githubId: 'macKlein', reviewerOf: ['boris-britva'] },
      { githubId: 'boris-britva', reviewerOf: ['rediska'] },
      { githubId: 'rediska', reviewerOf: ['john'] },
    ]);
  });

  it('createReviewerDistribution should create reviewer distribution per 2 reviewers amount', () => {
    distribution = createReviewerDistribution(list, 2);

    expect(distribution).toEqual([
      { githubId: 'john', reviewerOf: ['jack', 'macKlein'] },
      { githubId: 'jack', reviewerOf: ['macKlein', 'boris-britva'] },
      { githubId: 'macKlein', reviewerOf: ['boris-britva', 'rediska'] },
      { githubId: 'boris-britva', reviewerOf: ['rediska', 'john'] },
      { githubId: 'rediska', reviewerOf: ['john', 'jack'] },
    ]);
  });

  it('attendee amount should be equal a result length', () => {
    expect(distribution.length).toBe(list.length);
  });
});
