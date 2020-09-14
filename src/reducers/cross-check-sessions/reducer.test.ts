import configureMockStore from 'redux-mock-store';
import thunk, { ThunkDispatch } from 'redux-thunk';
import fetchMock from 'fetch-mock';
import reducer, { types, actions } from '.';
import helper, {
  addReviewerToRequest,
  updateReviewers,
  updateRequest,
  getReviewerDataById,
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

const remoteRequestData: Array<types.TRemoteRequestData> = [
  {
    id: 'rev-req-1',
    author: 'jack',
    state: 'PUBLISHED',
  },
  {
    id: 'rev-req-2',
    author: 'john',
    state: 'PUBLISHED',
  },
  {
    id: 'rev-req-3',
    author: 'boris-britva',
    state: 'PUBLISHED',
  },
  {
    id: 'rev-req-4',
    author: 'macKlein',
    state: 'PUBLISHED',
  },
  {
    id: 'rev-req-5',
    author: 'rediska',
    state: 'PUBLISHED',
  },
  {
    id: 'rev-req-6',
    author: 'rabbit',
    state: 'DRAFT',
  },
];

const remoteReviewData: Array<types.TRemoteReviewsData> = [
  {
    id: 'rev-1',
    requestId: 'rev-req-2',
    author: 'jack',
    score: 54,
    state: 'ACCEPTED',
  },
  {
    id: 'rev-2',
    requestId: 'rev-req-5',
    author: 'jack',
    score: 53,
    state: 'ACCEPTED',
  },
  {
    id: 'rev-3',
    requestId: 'rev-req-3',
    author: 'john',
    score: 88,
    state: 'DISPUTED',
  },
  {
    id: 'rev-4',
    requestId: 'rev-req-5',
    author: 'john',
    score: 81,
    state: 'ACCEPTED',
  },
  {
    id: 'rev-5',
    requestId: 'rev-req-4',
    author: 'boris-britva',
    score: 45,
    state: 'ACCEPTED',
  },
  {
    id: 'rev-6',
    requestId: 'rev-req-1',
    author: 'boris-britva',
    score: 48,
    state: 'ACCEPTED',
  },
  {
    id: 'rev-7',
    requestId: 'rev-req-1',
    author: 'macKlein',
    score: 57,
    state: 'ACCEPTED',
  },
  {
    id: 'rev-8',
    requestId: 'rev-req-2',
    author: 'macKlein',
    score: 51,
    state: 'ACCEPTED',
  },
  {
    id: 'rev-9',
    requestId: 'rev-req-3',
    author: 'rediska',
    score: 80,
    state: 'ACCEPTED',
  },
  {
    id: 'rev-10',
    requestId: 'rev-req-4',
    author: 'rediska',
    score: 89,
    state: 'ACCEPTED',
  },
];

jest.mock('lodash.shuffle', () =>
  jest.fn().mockReturnValue([
    {
      id: 'rev-req-2',
      author: 'john',
      state: 'PUBLISHED',
    },
    {
      id: 'rev-req-1',
      author: 'jack',
      state: 'PUBLISHED',
    },
    {
      id: 'rev-req-4',
      author: 'macKlein',
      state: 'PUBLISHED',
    },
    {
      id: 'rev-req-3',
      author: 'boris-britva',
      state: 'PUBLISHED',
    },
    {
      id: 'rev-req-5',
      author: 'rediska',
      state: 'PUBLISHED',
    },
  ])
);

describe('Cross-check-session utils:', () => {
  let requestList: Array<types.TRequestProps>;
  it('getSessionIndex should return an session index', () => {
    const index = helper.getSessionIndex('rss2020Q3Angular', data);
    expect(index).toBe(1);
  });

  it('prepareRemoteRequestData should filter data by state "PUBLISHED" and prepare each request', () => {
    requestList = helper.prepareRemoteRequestData(remoteRequestData);
    expect(requestList).toMatchSnapshot();
  });

  it('addReviewerToRequest should add reviewers to an attendee', () => {
    const reviewers = addReviewerToRequest(requestList, 2)([], requestList[0], 0);
    expect(reviewers).toMatchSnapshot();
  });

  it('getReviewerDataById should get reviewer by id ("rev-req-5") and author-name ("john")', () => {
    const reviewer = getReviewerDataById('rev-req-5', 'john', remoteReviewData);
    expect(reviewer).toMatchSnapshot();
  });

  describe('createReviewerDistribution:', () => {
    let distribution;

    it('should create reviewer distribution per 1 reviewers amount', () => {
      distribution = helper.createReviewerDistribution(requestList, 1);
      expect(distribution).toMatchSnapshot();
    });

    it('should create reviewer distribution per 2 reviewers amount', () => {
      distribution = helper.createReviewerDistribution(requestList, 2);
      expect(distribution).toMatchSnapshot();
    });

    it('reviewers without state PUBLISHED should not be added', () => {
      expect(distribution.length).toBe(remoteRequestData.length - 1);
    });
  });

  describe('updateRequest: ', () => {
    const request: types.TRequest = {
      author: 'john',
      id: 'rev-req-2',
      score: null,
      state: 'PUBLISHED',
      reviewerOf: [
        {
          author: 'jack',
          score: 0,
          state: null,
        },
        {
          author: 'macKlein',
          score: 0,
          state: null,
        },
      ],
    };

    const updatedReviewers = updateReviewers('rev-req-2', request.reviewerOf, remoteReviewData);
    it('updateReviewers should update reviewers data of request', () => {
      expect(updatedReviewers).toMatchSnapshot();
    });

    it('should update request data', () => {
      const updatedRequest = updateRequest(request, updatedReviewers);
      expect(updatedRequest).toMatchSnapshot();
    });
  });

  describe('updateAllRequests', () => {
    it('should update all requests for cross-check session', () => {
      const requests = helper.createReviewerDistribution(
        helper.prepareRemoteRequestData(remoteRequestData),
        2
      );
      const result = helper.updateAllRequests(remoteReviewData, requests);
      expect(result).toMatchSnapshot();
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
    const state = reducer({ ...initState, sessions: data }, actions.updateSession(inputData));
    const indexOfUpdatedSession = helper.getSessionIndex('rss2020Q3Angular', state.sessions);

    expect(state.sessions[indexOfUpdatedSession]).toEqual({
      ...state.sessions[indexOfUpdatedSession],
      ...inputData,
    });
  });

  it('deleteSession action should remove a session by id', () => {
    const id = 'rss2020Q3Angular';
    const state = reducer({ ...initState, sessions: data }, actions.deleteSession(id));
    const index = helper.getSessionIndex(id, state.sessions);

    expect(index).toBe(-1);
    expect(state.sessions).toEqual(data.filter((session) => session.id !== id));
  });

  it('openRequestGathering action should change session state to "REQUEST_GATHERING"', () => {
    const id = 'rss2020Q3react';
    const state = reducer({ ...initState, sessions: data }, actions.openRequestGathering(id));
    const index = helper.getSessionIndex(id, state.sessions);

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
    attendees: helper.createReviewerDistribution(
      helper.prepareRemoteRequestData(remoteRequestData),
      2
    ),
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
