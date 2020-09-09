import reducer, { types, actions } from '.';

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
  describe('setSessionsData action:', () => {
    const action = actions.setSessionsData(data);
    const newState = reducer(initState, action);

    it('should set data', () => {
      expect(newState.sessions).toEqual(data);
    });

    it('should not change select value', () => {
      expect(newState.selected).toBe(initState.selected);
    });
  });

  describe('createSession action:', () => {
    const newSession = data[0];
    const action = actions.createSession(newSession);
    const newState = reducer(initState, action);

    it('should add new session to sessions data', () => {
      expect(newState.sessions.length).toBeGreaterThan(
        initState.sessions.length
      );
    });

    it('should create new session', () => {
      expect(newState.sessions.find((session) => session?.id === 'rss2020Q3react')).toEqual(newSession);
    });
  });
});
