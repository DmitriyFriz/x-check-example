import configureMockStore from 'redux-mock-store';
import thunk, { ThunkDispatch } from 'redux-thunk';
import fetchMock from 'fetch-mock';
import reducer, { types, actions } from '.';
import {
  addReviewerToAttendee,
  createReviewerDistribution,
  getRequestList,
  getSessionIndex,
} from './utils';
import { initCrossCheck, api } from './operations';
import { TAppStateType } from '..';

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
    desiredReviewersAmount: 2,
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
    desiredReviewersAmount: 2,
    attendees: [],
  },
];

const remoteRequestData = [
  {
    id: 'rev-req-1',
    author: 'jack',
    task: 'simple-task-v1',
  },
  {
    id: 'rev-req-2',
    author: 'john',
    task: 'simple-task-v1',
  },
  {
    id: 'rev-req-3',
    author: 'boris-britva',
    task: 'simple-task-v1',
  },
  {
    id: 'rev-req-4',
    author: 'macKlein',
    task: 'simple-task-v1',
  },
  {
    id: 'rev-req-5',
    author: 'rediska',
    task: 'simple-task-v1',
  },
];

const requests = [
  {
    id: 'rev-req-1',
    author: 'jack',
  },
  {
    id: 'rev-req-2',
    author: 'john',
  },
  {
    id: 'rev-req-3',
    author: 'boris-britva',
  },
  {
    id: 'rev-req-4',
    author: 'macKlein',
  },
  {
    id: 'rev-req-5',
    author: 'rediska',
  },
];

jest.mock('lodash.shuffle', () =>
  jest.fn().mockReturnValue([
    {
      id: 'rev-req-2',
      author: 'john',
    },
    {
      id: 'rev-req-1',
      author: 'jack',
    },
    {
      id: 'rev-req-4',
      author: 'macKlein',
    },
    {
      id: 'rev-req-3',
      author: 'boris-britva',
    },
    {
      id: 'rev-req-5',
      author: 'rediska',
    },
  ])
);

describe('Cross-check-session utils:', () => {
  it('getSessionIndex should return an session index', () => {
    const index = getSessionIndex('rss2020Q3Angular', data);
    expect(index).toBe(1);
  });

  it('getRequestList should return an request list', () => {
    const requestList = getRequestList(remoteRequestData);
    expect(requestList).toEqual(requests);
  });

  it('addReviewerToAttendee should add reviewers to an attendee', () => {
    const reviewers = addReviewerToAttendee(remoteRequestData, 2)(
      [],
      remoteRequestData[0],
      0
    );
    expect(reviewers).toEqual([
      { id: 'rev-req-1', author: 'jack', reviewerOf: ['john', 'boris-britva'] },
    ]);
  });

  describe('createReviewerDistribution:', () => {
    let distribution;

    it('createReviewerDistribution should create reviewer distribution per 1 reviewers amount', () => {
      distribution = createReviewerDistribution(remoteRequestData, 1);
      expect(distribution).toEqual([
        { id: 'rev-req-2', author: 'john', reviewerOf: ['jack'] },
        { id: 'rev-req-1', author: 'jack', reviewerOf: ['macKlein'] },
        { id: 'rev-req-4', author: 'macKlein', reviewerOf: ['boris-britva'] },
        { id: 'rev-req-3', author: 'boris-britva', reviewerOf: ['rediska'] },
        { id: 'rev-req-5', author: 'rediska', reviewerOf: ['john'] },
      ]);
    });

    it('createReviewerDistribution should create reviewer distribution per 2 reviewers amount', () => {
      distribution = createReviewerDistribution(remoteRequestData, 2);
      expect(distribution).toEqual([
        {
          id: 'rev-req-2',
          author: 'john',
          reviewerOf: ['jack', 'macKlein'],
        },
        {
          id: 'rev-req-1',
          author: 'jack',
          reviewerOf: ['macKlein', 'boris-britva'],
        },
        {
          id: 'rev-req-4',
          author: 'macKlein',
          reviewerOf: ['boris-britva', 'rediska'],
        },
        {
          id: 'rev-req-3',
          author: 'boris-britva',
          reviewerOf: ['rediska', 'john'],
        },
        {
          id: 'rev-req-5',
          author: 'rediska',
          reviewerOf: ['john', 'jack'],
        },
      ]);
    });

    it('attendee amount should be equal a result length', () => {
      expect(distribution.length).toBe(remoteRequestData.length);
    });
  });
});

describe('Cross-check-session reducer', () => {
  it('setSessionsData action should set a data', () => {
    const state = reducer(initState, actions.setSessionsData(data));

    expect(state.sessions).toEqual(data);
    expect(state.selected).toBe(initState.selected);
  });

  it('selectSession action should add id session to "selected" key', () => {
    const id = 'rss2020Q3react';
    const state = reducer(initState, actions.selectSession(id));

    expect(state.selected).not.toBeNull();
    expect(state.selected).toBe(id);
  });

  it('createSession action should add a new session to sessions data', () => {
    const newSession = data[0];
    const state = reducer(initState, actions.createSession(newSession));

    expect(state.sessions.length).toBeGreaterThan(initState.sessions.length);
    expect(state.sessions[0]).toEqual(newSession);
  });

  it('updateSession action should update a session data by id', () => {
    const inputData: types.TUpdatedData = {
      id: 'rss2020Q3Angular',
      state: 'COMPLETED',
      coefficient: 0.8,
    };
    const state = reducer(
      { ...initState, sessions: data },
      actions.updateSession(inputData)
    );
    const indexOfUpdatedSession = getSessionIndex(
      'rss2020Q3Angular',
      state.sessions
    );

    expect(state.sessions[indexOfUpdatedSession]).toEqual({
      ...state.sessions[indexOfUpdatedSession],
      ...inputData,
    });
  });

  it('deleteSession action should remove a session by id', () => {
    const id = 'rss2020Q3Angular';
    const state = reducer(
      { ...initState, sessions: data },
      actions.deleteSession(id)
    );
    const index = getSessionIndex(id, state.sessions);

    expect(index).toBe(-1);
    expect(state.sessions).toEqual(data.filter((session) => session.id !== id));
  });

  it('openRequestGathering action should change session state to "REQUEST_GATHERING"', () => {
    const id = 'rss2020Q3react';
    const state = reducer(
      { ...initState, sessions: data },
      actions.openRequestGathering(id)
    );
    const index = getSessionIndex(id, state.sessions);

    expect(state.sessions[index].state).toBe('REQUESTS_GATHERING');
    expect(state.sessions[index]).toEqual({
      ...data[index],
      state: 'REQUESTS_GATHERING',
    });
  });
});

describe('initCrossCheck operation', () => {
  let action: types.TUpdateSession;

  beforeEach(async () => {
    fetchMock.getOnce(/id=rss2020Q3react/, {
      status: 200,
      body: JSON.stringify(remoteRequestData),
    });

    fetchMock.putOnce(/rss2020Q3react/, {
      status: 200,
      body: JSON.stringify(updatedData),
    });
  
    await store.dispatch(initCrossCheck(id));
    [action] = store.getActions();
  });

  afterEach(() => {
    fetchMock.restore();
  });

  type MockStore = { crossCheckSession: types.TState };
  type DispatchExts = ThunkDispatch<TAppStateType, void, types.TAction>;

  const middleWares = [thunk];
  const mockStore = configureMockStore<MockStore, DispatchExts>(middleWares);

  const spyUpdate = jest.spyOn(api.crossChecks, 'update');
  const spyGetByFilter = jest.spyOn(api.reviewRequests, 'getByFilter');

  const id = 'rss2020Q3react';
  const store = mockStore({
    crossCheckSession: {
      sessions: [...data],
      selected: id,
    },
  });
  const updatedData: types.TSessionData = {
    ...data[0],
    state: 'CROSS_CHECK',
    attendees: createReviewerDistribution(remoteRequestData, 2),
  };

  it('session should send a request to get requests', () => {
    expect(spyGetByFilter).toBeCalled();
    expect(spyGetByFilter).toBeCalledWith(`id=${id}`);
  });

  it('session should have a state "CROSS_CHECK"', () => {
    expect(action.payload.data.state).toBe('CROSS_CHECK');
  });

  it('session should have a reviewers distribution', () => {
    expect(action.payload.data.attendees).toEqual(updatedData.attendees);
  });

  it('should send a request to update a session', () => {
    expect(spyUpdate).toBeCalled();
    expect(spyUpdate).toBeCalledWith('rss2020Q3react', updatedData);
  });
});
