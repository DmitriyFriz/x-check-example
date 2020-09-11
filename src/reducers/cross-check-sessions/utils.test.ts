import {
  addReviewerToAttendee,
  createReviewerDistribution,
  getAttendeeList,
  getSessionIndex,
} from './utils';

const sessions = [
  {
    id: 'rss2020Q3react',
  },
  {
    id: 'rss2020Q3Angular',
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
const list = ['jack', 'john', 'boris-britva', 'macKlein', 'rediska'];
jest.mock('lodash.shuffle', () =>
  jest
    .fn()
    .mockReturnValue(['john', 'jack', 'macKlein', 'boris-britva', 'rediska'])
);

describe('Cross-check-session utils: getSessionIndex', () => {
  it('should return an session index', () => {
    const index = getSessionIndex('rss2020Q3Angular', sessions);
    expect(index).toBe(1);
  });
});

describe('Cross-check-session utils: getAttendeeList', () => {
  it('should return an attendee list', () => {
    const attendeeList = getAttendeeList(requests);
    expect(attendeeList).toEqual(list);
  });
});

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
