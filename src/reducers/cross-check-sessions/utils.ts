import shuffle from 'lodash.shuffle';
import * as types from './types';

export const getSessionIndex = (id: string, data: Array<types.TSessionData>) =>
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
  list: Array<string>,
  reviewersAmount: number
) => (
  attendeeList: Array<types.TAttendee>,
  author: string,
  index: number
): Array<types.TAttendee> => {
  const reviewerOf: Array<string> = [];
  let currentIndex = index;
  while (reviewerOf.length < reviewersAmount) {
    currentIndex = (list.length + currentIndex + 1) % list.length;
    reviewerOf.push(list[currentIndex]);
  }

  return [
    ...attendeeList,
    {
      githubId: author,
      reviewerOf,
    },
  ];
};

export const createReviewerDistribution = (
  attendees: Array<string>,
  reviewersAmount: number
): Array<types.TAttendee> => {
  const shuffledList = shuffle(attendees);

  return shuffledList.reduce(
    addReviewerToAttendee(shuffledList, reviewersAmount),
    []
  );
};
