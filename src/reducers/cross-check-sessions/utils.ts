import shuffle from 'lodash.shuffle';
import * as types from './types';

export const getSessionIndex = (id: string, data: Array<{ id: string }>) =>
  data.findIndex((session) => session?.id === id);

export const updateSession = (
  inputData: types.TUpdatedData,
  sessionData: Array<types.TSessionData>
) => {
  const updatedData = [...sessionData];
  const index = getSessionIndex(inputData.id, updatedData);
  if (index === -1) {
    return updatedData;
  }
  updatedData[index] = { ...updatedData[index], ...inputData };

  return updatedData;
};

type TAddReviewerToRequest = (
  list: Array<types.TRequestProps>,
  reviewersAmount: number
) => (
  requestsWithReviewers: Array<types.TRequest>,
  request: types.TRequestProps,
  index: number
) => Array<types.TRequest>;

export const addReviewerToRequest: TAddReviewerToRequest = (list, reviewersAmount) => {
  return (requestsWithReviewers, request, index) => {
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

    return [
      ...requestsWithReviewers,
      {
        id: request.id,
        author: request.author,
        score: null,
        state: request.state,
        reviewerOf,
      },
    ];
  };
};

export const createReviewerDistribution = (
  requests: Array<types.TRequestProps>,
  reviewersAmount: number
): Array<types.TRequest> => {
  const shuffledList = shuffle(requests);

  return shuffledList.reduce(addReviewerToRequest(shuffledList, reviewersAmount), []);
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

type TGetRequestList = (
  remoteRequestData: Array<types.TRemoteRequestData>
) => Array<types.TRequestProps>;

export const prepareRemoteRequestData: TGetRequestList = (remoteRequestData) =>
  remoteRequestData.filter((request) => request.state === 'PUBLISHED').reduce(prepareRequest, []);

export const getReviewerDataById = (
  requestId: string,
  author: string,
  remoteReviewList: Array<types.TRemoteReviewsData>
) => remoteReviewList.find((review) => review.requestId === requestId && review.author === author);

export const updateReviewers = (
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

export const updateRequest = (request: types.TRequest, reviewList: Array<types.TReviewer>) => {
  const withUpdatedReviewers: types.TRequest = { ...request, reviewerOf: reviewList };
  return reviewList.reduce(
    (prevRequest, review): types.TRequest => {
      const score =
        prevRequest.score === null
          ? review.score
          : Math.round(((prevRequest.score + review.score) as number) / 2);

      return {
        ...prevRequest,
        score: review.state === 'ACCEPTED' ? score : prevRequest.score,
      };
    },
    { ...withUpdatedReviewers }
  );
};

export const updateAllRequests = (
  remoteReviewList: Array<types.TRemoteReviewsData>,
  requestList: Array<types.TRequest>
) => {
  return [...requestList].map((request) => {
    const updatedReviewers = updateReviewers(request.id, request.reviewerOf, remoteReviewList);
    return updateRequest(request, updatedReviewers);
  });
};
