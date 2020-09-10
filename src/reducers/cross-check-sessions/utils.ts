import * as types from './types';

export const getSessionIndex = (id: string, data: Array<types.TSessionData>) =>
  data.findIndex((session) => session?.id === id);

export const updateSession = (
  inputData: types.TUpdatedData,
  sessionData: Array<types.TSessionData>
) => {
  const updatedData = [...sessionData];
  const index = getSessionIndex(inputData.id, updatedData);
  updatedData[index] = { ...updatedData[index], ...inputData };

  return updatedData;
};
