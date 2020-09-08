import { TAppStateType } from '..';

export const getUserData = (state: TAppStateType) => state.user;
export const getStatus = (state: TAppStateType) => state.user.status;
