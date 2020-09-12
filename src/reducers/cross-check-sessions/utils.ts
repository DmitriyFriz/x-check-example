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

export const addReviewerToAttendee = (
  list: Array<types.TRequest>,
  reviewersAmount: number
) => (
  attendeeList: Array<types.TAttendee>,
  request: types.TRequest,
  index: number
): Array<types.TAttendee> => {
  const reviewerOf: Array<types.TReviewer> = [];
  let currentIndex = index;
  while (reviewerOf.length < reviewersAmount) {
    currentIndex = (list.length + currentIndex + 1) % list.length;
    reviewerOf.push({
      author: list[currentIndex].author,
      score: 0
    });
  }

  return [
    ...attendeeList,
    {
      id: request.id,
      author: request.author,
      score: 0,
      reviewerOf,
    },
  ];
};

export const createReviewerDistribution = (
  attendees: Array<types.TRequest>,
  reviewersAmount: number
): Array<types.TAttendee> => {
  const shuffledList = shuffle(attendees);

  return shuffledList.reduce(
    addReviewerToAttendee(shuffledList, reviewersAmount),
    []
  );
};

type TGetRequestList = (
  requestData: Array<types.TRemoteRequestData>
) => Array<types.TRequest>;

const addRequest = (
  requestList: Array<types.TRequest>,
  request: types.TRemoteRequestData
): Array<types.TRequest> => [
  ...requestList,
  {
    id: request.id,
    author: request.author,
    score: 0,
  },
];

export const getRequestList: TGetRequestList = (requestData) =>
  requestData.reduce(addRequest, []);

// export const createReview = (
//   request: types.TAttendee & types.Partial<types.TReview>,
//   remoteReviewData: types.TRemoteReviewsData,
// ): types.TReview => {
//   const review = 

// };
