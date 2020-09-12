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
  list: Array<types.TRequest>,
  reviewersAmount: number
) => (
  requestsWithReviewers: Array<types.TRequestWithReviewers>,
  request: types.TRequest,
  index: number
) => Array<types.TRequestWithReviewers>;

export const addReviewerToRequest: TAddReviewerToRequest = (list, reviewersAmount) => {
  return (requestsWithReviewers, request, index) => {
    const reviewerOf: Array<types.TReviewer> = [];
    let currentIndex = index;
    while (reviewerOf.length < reviewersAmount) {
      currentIndex = (list.length + currentIndex + 1) % list.length;
      reviewerOf.push({
        author: list[currentIndex].author,
        score: null,
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
  requests: Array<types.TRequest>,
  reviewersAmount: number
): Array<types.TRequestWithReviewers> => {
  const shuffledList = shuffle(requests);

  return shuffledList.reduce(addReviewerToRequest(shuffledList, reviewersAmount), []);
};

const addRequest = (
  requestList: Array<types.TRequest>,
  request: types.TRemoteRequestData
): Array<types.TRequest> => [
  ...requestList,
  {
    id: request.id,
    author: request.author,
    score: null,
    state: request.state,
  },
];

type TGetRequestList = (requestData: Array<types.TRemoteRequestData>) => Array<types.TRequest>;

export const getRequestList: TGetRequestList = (requestData) =>
  requestData.filter((request) => request.state === 'PUBLISHED').reduce(addRequest, []);

// export const getReviewList: TGetRequestList = (requestData) =>
//   requestData
//     .filter((request) => request.state === 'PUBLISHED')
//     .reduce(addRequest, []);

export const addScoreToReviewer = (remoteReviewData: types.TRemoteReviewsData) => {
  return (reviewers: Array<types.TReviewer>) =>
    reviewers.map(
      (reviewer): types.TReviewer => {
        if (reviewer.author !== remoteReviewData.author) {
          return reviewer;
        }

        return {
          ...reviewer,
          score: remoteReviewData.score,
          state: remoteReviewData.state,
        };
      }
    );
};

export const addScoreToRequest = (
  request: types.TRequestWithReviewers,
  reviewList: Array<types.TRemoteReviewsData>
) => {
  return reviewList.reduce(
    (prevRequest, review): types.TRequestWithReviewers => {
      const reviewerWithScore = addScoreToReviewer(review)(prevRequest.reviewerOf);
      const score =
        prevRequest.score === null
          ? review.score
          : Math.round((prevRequest.score + review.score) / 2);

      return {
        ...prevRequest,
        reviewerOf: reviewerWithScore,
        score: review.state !== 'ACCEPTED' ? prevRequest.score : score,
      };
    },
    { ...request }
  );
};

export const getReviewersByRequestId = (id: string, reviewList: Array<types.TRemoteReviewsData>) =>
  reviewList.filter((review) => review.requestId === id);

export const addScoreToAllRequests = (
  reviewList: Array<types.TRemoteReviewsData>,
  requestList: Array<types.TRequestWithReviewers>
) => {
  return [...requestList].map((request) => {
    const reviewers = getReviewersByRequestId(request.id, reviewList);
    return addScoreToRequest(request, reviewers);
  });
};
