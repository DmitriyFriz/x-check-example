import { TAppStateType } from '..';

export const getUserId = (state: TAppStateType) => state.user.githubId;
