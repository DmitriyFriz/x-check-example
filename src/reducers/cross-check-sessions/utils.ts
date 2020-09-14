import shuffle from 'lodash.shuffle';
import * as types from './types';

interface ISessionHelper {
  getSessionIndex: (id: string, data: Array<{ id: string }>) => number;

  updateSession: (
    inputData: types.TUpdatedData,
    sessionData: Array<types.TSessionData>
  ) => Array<types.TSessionData>;

  prepareRemoteRequestData: (
    remoteRequestData: Array<types.TRemoteRequestData>
  ) => Array<types.TRequestProps>;

  createReviewerDistribution: (
    requests: Array<types.TRequestProps>,
    reviewersAmount: number
  ) => Array<types.TRequest>;

  updateAllRequests: (
    remoteReviewList: Array<types.TRemoteReviewsData>,
    requestList: Array<types.TRequest>
  ) => Array<types.TRequest>;
}

const sessionHelper: ISessionHelper = {
  getSessionIndex: (id, data) => data.findIndex((session) => session?.id === id),

  updateSession(inputData, sessionData) {
    const updatedData = [...sessionData];
    const index = this.getSessionIndex(inputData.id, updatedData);
    if (index === -1) {
      return updatedData;
    }
    updatedData[index] = { ...updatedData[index], ...inputData };

    return updatedData;
  },

  prepareRemoteRequestData: (remoteRequestData) =>
    remoteRequestData.filter((request) => request.state === 'PUBLISHED').reduce(prepareRequest, []),

  createReviewerDistribution: (requests, reviewersAmount) => {
    const shuffledList = shuffle(requests);

    return shuffledList.reduce(addReviewerToRequest(shuffledList, reviewersAmount), []);
  },

  updateAllRequests: (remoteReviewList, requestList) =>
    [...requestList].map((request) => {
      const updatedReviewers = updateReviewers(request.id, request.reviewerOf, remoteReviewList);
      return updateRequest(request, updatedReviewers);
    }),
};

const prepareRequest = (
  requestList: Array<types.TRequestProps>,
  request: types.TRemoteRequestData
): Array<types.TRequestProps> => [
  ...requestList,
  {
    id: request.id,
    author: request.author,
    score: null,
    state: request.state,
  },
];

const createReviewerOf = (
  list: Array<types.TRequestProps>,
  reviewersAmount: number,
  index: number
) => {
  const reviewerOf: Array<types.TReviewer> = [];
  let currentIndex = index;
  while (reviewerOf.length < reviewersAmount) {
    currentIndex = (list.length + currentIndex + 1) % list.length;
    reviewerOf.push({
      author: list[currentIndex].author,
      score: 0,
      state: null,
    });
  }

  return reviewerOf;
};

type TAddReviewerToRequest = (
  list: Array<types.TRequestProps>,
  reviewersAmount: number
) => (
  requestsWithReviewers: Array<types.TRequest>,
  request: types.TRequestProps,
  index: number
) => Array<types.TRequest>;

const addReviewerToRequest: TAddReviewerToRequest = (list, reviewersAmount) => {
  return (requestsWithReviewers, request, index) => {
    return [
      ...requestsWithReviewers,
      {
        ...request,
        score: null,
        reviewerOf: createReviewerOf(list, reviewersAmount, index),
      },
    ];
  };
};

const getReviewerDataById = (
  requestId: string,
  author: string,
  remoteReviewList: Array<types.TRemoteReviewsData>
) => remoteReviewList.find((review) => review.requestId === requestId && review.author === author);

const updateReviewers = (
  requestId: string,
  reviewers: Array<types.TReviewer>,
  remoteReviewList: Array<types.TRemoteReviewsData>
) =>
  reviewers.map(
    (reviewer): types.TReviewer => {
      const remoteReviewerData = getReviewerDataById(requestId, reviewer.author, remoteReviewList);
      if (!remoteReviewerData) {
        return reviewer;
      }

      return {
        ...reviewer,
        score: remoteReviewerData.score,
        state: remoteReviewerData.state,
      };
    }
  );

const calculateScore = (requestScore: null | number, reviewScore: number) =>
  requestScore === null ? reviewScore : Math.round(((requestScore + reviewScore) as number) / 2);

const updateRequest = (request: types.TRequest, reviewList: Array<types.TReviewer>) => {
  const withUpdatedReviewers: types.TRequest = { ...request, reviewerOf: reviewList };
  return reviewList.reduce(
    (prevRequest, review): types.TRequest => {
      return {
        ...prevRequest,
        score:
          review.state === 'ACCEPTED'
            ? calculateScore(prevRequest.score, review.score)
            : prevRequest.score,
      };
    },
    { ...withUpdatedReviewers }
  );
};

export default sessionHelper;
export { addReviewerToRequest, getReviewerDataById, updateReviewers, updateRequest };
