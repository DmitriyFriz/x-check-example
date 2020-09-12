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
  attendeeList: Array<types.TAttendee>,
  request: types.TRequest,
  index: number
) => Array<types.TAttendee>;

export const addReviewerToRequest: TAddReviewerToRequest = (
  list,
  reviewersAmount
) => {
  return (attendeeList, request, index) => {
    const reviewerOf: Array<types.TReviewer> = [];
    let currentIndex = index;
    while (reviewerOf.length < reviewersAmount) {
      currentIndex = (list.length + currentIndex + 1) % list.length;
      reviewerOf.push({
        author: list[currentIndex].author,
        score: null,
      });
    }

    return [
      ...attendeeList,
      {
        id: request.id,
        author: request.author,
        score: null,
        reviewerOf,
      },
    ];
  };
};

export const createReviewerDistribution = (
  attendees: Array<types.TRequest>,
  reviewersAmount: number
): Array<types.TAttendee> => {
  const shuffledList = shuffle(attendees);

  return shuffledList.reduce(
    addReviewerToRequest(shuffledList, reviewersAmount),
    []
  );
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
  },
];

type TGetRequestList = (
  requestData: Array<types.TRemoteRequestData>
) => Array<types.TRequest>;

export const getRequestList: TGetRequestList = (requestData) =>
  requestData.reduce(addRequest, []);

export const addScoreToReviewer = (
  remoteReviewData: types.TRemoteReviewsData
) => {
  return (reviewers: Array<types.TReviewer>) =>
    reviewers.map(
      (reviewer): types.TReviewer => {
        if (reviewer.author !== remoteReviewData.author) {
          return reviewer;
        }

        return {
          ...reviewer,
          score: remoteReviewData.score,
        };
      }
    );
};

export const addScoreToRequest = (
  request: types.TAttendee,
  remoteReviewData: types.TRemoteReviewsData
): types.TAttendee => {
  if (request.id !== remoteReviewData.requestId) {
    return request;
  }

  return {
    ...request,
    score:
      request.score === null
        ? remoteReviewData.score
        : Math.round((request.score + remoteReviewData.score) / 2),
    reviewerOf: addScoreToReviewer(remoteReviewData)(request.reviewerOf),
  };
};

export const addScoreToAllRequests = (
  reviewList: Array<types.TRemoteReviewsData>,
  requestList: Array<types.TAttendee>
) =>
  [...requestList].map((request) => {
    let requestWithScore = { ...request };
    const reviewers = reviewList.filter(
      (review) => review.requestId === request.id
    );
    reviewers.forEach((review) => {
      requestWithScore = addScoreToRequest(requestWithScore, review);
    });

    return requestWithScore;
  });
