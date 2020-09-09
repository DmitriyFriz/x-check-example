import * as types from './types';

export const updateSession = (
  inputData: types.TUpdatedData,
  sessionData: Array<types.TSessionData>
) => {
  const updatedData = sessionData;
  const index = updatedData.findIndex(
    (session) => session?.id === inputData.id
  );
  updatedData[index] = { ...updatedData[index], ...inputData };

  return updatedData;
};
