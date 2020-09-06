export const SIGN_IN = 'SIGN_IN';

export type TRole = 'author' | 'student' | null;

export type TUserData = {
  githubId: string | null;
  role: TRole;
};

export type TSignIn = {
  type: typeof SIGN_IN;
  payload: TUserData;
};

export type TAction = TSignIn;