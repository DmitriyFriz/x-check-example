export const SIGN_IN = 'SIGN_IN';

export type TRole = 'author' | 'student' | null;

export type TStatus = 'unauthorized' | 'authorized' | null;

export type TUserData = {
  githubId: string | null;
  role: TRole;
  status: TStatus;
};

export type TSignIn = {
  type: typeof SIGN_IN;
  payload: TUserData;
};

export type TAction = TSignIn;
